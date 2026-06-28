import shutil
import os

files = [
    ('/Users/dewanshpoddar/.gemini/antigravity-ide/brain/432cdb25-24ca-4fa3-a798-5d43692bf116/calc_maturity_banner_v2_1782600466693.png', '/Users/dewanshpoddar/PW/public/assets/hero-maturity.png')
]

print("Starting custom maturity banner setup...")
for src, dest in files:
    try:
        os.makedirs(os.path.dirname(dest), exist_ok=True)
        shutil.copyfile(src, dest)
        print(f" -> Copied successfully to: {os.path.basename(dest)}")
    except Exception as e:
        print(f" -> Failed to copy {os.path.basename(src)}: {e}")
print("Assets setup completed.")
