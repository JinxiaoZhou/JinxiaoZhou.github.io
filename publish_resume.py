# ---------------------------------------------------------------------------
# Publish the résumé to the portfolio site and push it live.
#
#   Usage:  python publish_resume.py "E:\Career\Resume\Resume Jinxiao 2026.docx"
#           python publish_resume.py --pdf-only "C:\some\already.pdf"
#           python publish_resume.py --no-push "E:\...\Resume.docx"   (local only)
#
# What it does
#   1. Converts the .docx to PDF using Word or WPS COM automation (Windows).
#   2. Copies it to assets/Jinxiao-Zhou-Resume.pdf  (the path index.html wants)
#   3. Commits and pushes to GitHub Pages.
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
TARGET_NAME = "Jinxiao-Zhou-Resume.pdf"
TARGET_PATH = os.path.join(SITE_DIR, "assets", TARGET_NAME)

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
    ap = argparse.ArgumentParser(description="把简历发布到 portfolio 站点")
    ap.add_argument("source", help="源文件：.docx 或已是 .pdf")
    ap.add_argument("--pdf-only", action="store_true",
                    help="源文件已经是 PDF，跳过转换")
    ap.add_argument("--no-push", action="store_true",
                    help="只更新本地文件，不提交不推送")
    args = ap.parse_args()

    src = os.path.abspath(args.source)
    if not os.path.exists(src):
        sys.exit(f"✗ 找不到源文件：{src}")

    os.makedirs(os.path.dirname(TARGET_PATH), exist_ok=True)

    # --- 1. produce a PDF -------------------------------------------------
    if args.pdf_only or src.lower().endswith(".pdf"):
        pdf = src
        print(f"✓ 使用已有 PDF：{os.path.basename(pdf)}")
    elif src.lower().endswith((".docx", ".doc")):
        tmp_pdf = os.path.join(tempfile.gettempdir(), TARGET_NAME)
        if os.path.exists(tmp_pdf):
            os.remove(tmp_pdf)
        print(f"→ 正在转换：{os.path.basename(src)}")
        ok, msg = convert_with_com(src, tmp_pdf)
        if not ok:
            sys.exit(
                f"✗ 转换失败：{msg}\n"
                f"  请用 Word/WPS 手动「另存为 PDF」，然后执行：\n"
                f"  python publish_resume.py --pdf-only \"<你的.pdf>\""
            )
        pdf = tmp_pdf
        print("✓ 转换完成")
    else:
        sys.exit("✗ 只支持 .docx / .doc / .pdf")

    # --- 2. place it where index.html expects it --------------------------
    shutil.copyfile(pdf, TARGET_PATH)
    size_kb = os.path.getsize(TARGET_PATH) / 1024
    print(f"✓ 已放置：assets/{TARGET_NAME}  ({size_kb:.0f} KB)")

    if size_kb < 20:
        print("⚠ 文件偏小，请确认导出的是完整简历")
    if size_kb > 5120:
        print("⚠ 超过 5 MB，建议压缩后再上传（网页加载会很慢）")

    # --- 3. commit & push -------------------------------------------------
    if args.no_push:
        print("· 已跳过 git 操作（--no-push）")
        print(f"\n完成。本地预览：http://localhost:8000/")
        return

    git("add", f"assets/{TARGET_NAME}")
    status = git("status", "--porcelain", f"assets/{TARGET_NAME}").stdout.strip()
    if not status:
        print("· 文件内容无变化，无需提交")
    else:
        git("commit", "-m", "Add résumé PDF and enable download button")
        print("✓ 已提交")

    push = git("push", check=False)
    if push.returncode == 0:
        print("✓ 已推送到 GitHub")
        print("\n约 1 分钟后生效：https://jinxiaozhou.github.io")
        print("按钮会自动出现，无需改动 index.html。")
    else:
        print("✗ 推送失败：")
        print("  " + (push.stderr or push.stdout).strip().replace("\n", "\n  "))


if __name__ == "__main__":
    main()
