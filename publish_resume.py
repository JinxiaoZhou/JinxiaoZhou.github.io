# ---------------------------------------------------------------------------
# Publish a résumé to the portfolio site and push it live.
#
#   English:  python publish_resume.py en "E:\Career\Resume\_public\Resume Jinxiao 2026 (public).docx"
#   Chinese:  python publish_resume.py zh "E:\Career\校招\材料\周津霄-多伦多大学-MIE (public).docx"
#
#   Already a PDF:   add --pdf-only
#   Local only:      add --no-push
#   Legacy (no lang): the first arg may be the file path; assumes English.
#
# The language argument decides which file the site writes, matching the
# download button in index.html for each language:
#   en -> assets/resume/Jinxiao-Zhou-Resume-EN.pdf
#   zh -> assets/resume/Jinxiao-Zhou-Resume-ZH.pdf
#
# Word/WPS is required for .docx -> .pdf. If neither is installed, export the
# PDF manually and re-run with --pdf-only.
# ---------------------------------------------------------------------------

import argparse
import os
import shutil
import subprocess
import sys
import tempfile

SITE_DIR = os.path.dirname(os.path.abspath(__file__))

#: language -> (target file name, human label)
TARGETS = {
    "en": ("Jinxiao-Zhou-Resume-EN.pdf", "English"),
    "zh": ("Jinxiao-Zhou-Resume-ZH.pdf", "中文"),
}

#: Kept for backwards compatibility with the single-résumé layout.
LEGACY_TARGET = "Jinxiao-Zhou-Resume.pdf"

WD_FORMAT_PDF = 17


def convert_with_com(docx_path, out_pdf):
    """Convert a .docx to PDF via Word/WPS COM automation.

    Returns (ok, message). Never raises for a missing COM provider.
    """
    try:
        import win32com.client
    except ImportError:
        return False, "未安装 pywin32"

    src = os.path.abspath(docx_path)
    app = None
    doc = None

    # Try Word first, then WPS Writer. Each attempt owns its own instance.
    for prog_id in ("Word.Application", "KWPS.Application"):
        try:
            app = win32com.client.Dispatch(prog_id)
        except Exception:
            continue

        try:
            try:
                app.Visible = False
                app.DisplayAlerts = 0
            except Exception:
                pass

            doc = app.Documents.Open(src, ReadOnly=True)
            doc.SaveAs(out_pdf, FileFormat=WD_FORMAT_PDF)

            if os.path.exists(out_pdf) and os.path.getsize(out_pdf) > 0:
                return True, f"ok ({prog_id})"
            return False, f"{prog_id} 未生成有效 PDF"
        except Exception as exc:
            last = f"{prog_id}: {exc}"
        finally:
            # Tear down in reverse order; ignore failure so the real error wins.
            try:
                if doc is not None:
                    doc.Close(False)
            except Exception:
                pass
            try:
                if app is not None:
                    app.Quit()
            except Exception:
                pass
            doc = None
            app = None

    return False, last if "last" in dir() else "未检测到 Word 或 WPS"


def git(*args, check=True):
    return subprocess.run(
        ["git", *args], cwd=SITE_DIR, check=check,
        capture_output=True, text=True, encoding="utf-8", errors="replace",
    )


def main():
    ap = argparse.ArgumentParser(
        description="把简历发布到 portfolio 站点",
        usage='%(prog)s {en|zh} "<简历文件>" [--pdf-only] [--no-push]',
    )
    ap.add_argument("lang", nargs="?", choices=sorted(TARGETS),
                    help="语言：en = 英文简历按钮，zh = 中文简历按钮")
    ap.add_argument("source", nargs="?", help="源文件：.docx 或已是 .pdf")
    ap.add_argument("--pdf-only", action="store_true",
                    help="源文件已经是 PDF，跳过转换")
    ap.add_argument("--no-push", action="store_true",
                    help="只更新本地文件，不提交不推送")
    args = ap.parse_args()

    # Backwards compatibility: a single path argument means English.
    if args.source is None:
        if args.lang is None:
            ap.error("请指定语言和目标文件，例如：publish_resume.py en \"resume.docx\"")
        args.lang, args.source = "en", args.lang

    target_name, label = TARGETS[args.lang]
    target_path = os.path.join(SITE_DIR, "assets", "resume", target_name)

    src = os.path.abspath(args.source)
    if not os.path.exists(src):
        sys.exit(f"✗ 找不到源文件：{src}")

    os.makedirs(os.path.dirname(target_path), exist_ok=True)

    print(f"· 目标：{label}简历 -> assets/resume/{target_name}")

    # --- 1. produce a PDF -------------------------------------------------
    if args.pdf_only or src.lower().endswith(".pdf"):
        pdf = src
        print(f"✓ 使用已有 PDF：{os.path.basename(pdf)}")
    elif src.lower().endswith((".docx", ".doc")):
        tmp_pdf = os.path.join(tempfile.gettempdir(), target_name)
        if os.path.exists(tmp_pdf):
            os.remove(tmp_pdf)
        print(f"→ 正在转换：{os.path.basename(src)}")
        ok, msg = convert_with_com(src, tmp_pdf)
        if not ok:
            sys.exit(
                f"✗ 转换失败：{msg}\n"
                f"  请用 Word/WPS 手动「另存为 PDF」，然后执行：\n"
                f'  python publish_resume.py {args.lang} --pdf-only "<你的.pdf>"'
            )
        pdf = tmp_pdf
        print("✓ 转换完成")
    else:
        sys.exit("✗ 只支持 .docx / .doc / .pdf")

    # --- 2. place it where index.html expects it --------------------------
    shutil.copyfile(pdf, target_path)
    size_kb = os.path.getsize(target_path) / 1024
    print(f"✓ 已放置：assets/resume/{target_name}  ({size_kb:.0f} KB)")

    if size_kb < 20:
        print("⚠ 文件偏小，请确认导出的是完整简历")
    if size_kb > 5120:
        print("⚠ 超过 5 MB，建议压缩后再上传（网页加载会很慢）")

    # Retire the old single-résumé file once both language slots exist.
    legacy = os.path.join(SITE_DIR, "assets", LEGACY_TARGET)
    if os.path.exists(legacy):
        os.remove(legacy)
        print(f"· 已移除旧文件 assets/{LEGACY_TARGET}")

    # --- 3. commit & push -------------------------------------------------
    if args.no_push:
        print("· 已跳过 git 操作（--no-push）")
        print("\n完成。本地预览：http://localhost:8000/")
        return

    git("add", "-A")
    status = git("status", "--porcelain").stdout.strip()
    if not status:
        print("· 文件内容无变化，无需提交")
    else:
        git("commit", "-m", f"Update {label} résumé PDF (assets/resume/{target_name})")
        print("✓ 已提交")

    push = git("push", check=False)

    # Another commit may have landed meanwhile (e.g. an edit made in the
    # GitHub web UI). Rebase onto it and retry once before giving up.
    if push.returncode != 0 and "rejected" in (push.stderr or ""):
        print("· 远程有新提交，正在同步后重试…")
        env_rebase = {"GIT_SEQUENCE_EDITOR": "true", "GIT_EDITOR": "true"}
        old_env = os.environ.copy()
        os.environ.update(env_rebase)
        try:
            git("fetch", "origin", "main", check=False)
            if git("rebase", "origin/main", check=False).returncode == 0:
                push = git("push", check=False)
            else:
                git("rebase", "--abort", check=False)
        finally:
            os.environ.clear()
            os.environ.update(old_env)

    if push.returncode == 0:
        print("✓ 已推送到 GitHub")
        print("\n约 1 分钟后生效：https://jinxiaozhou.github.io")
        print("按钮会自动出现，无需改动 index.html。")
    else:
        print("✗ 推送失败：")
        print("  " + (push.stderr or push.stdout).strip().replace("\n", "\n  "))
        print("\n  手动处理：git pull --rebase origin main  然后  git push")


if __name__ == "__main__":
    main()
