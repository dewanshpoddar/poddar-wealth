import shutil
import os

# Source images generated in the IDE brain artifacts folder
files = [
    ('/Users/dewanshpoddar/.gemini/antigravity-ide/brain/432cdb25-24ca-4fa3-a798-5d43692bf116/calc_coverage_banner_1782599112963.png', '/Users/dewanshpoddar/PW/public/assets/hero-coverage.png'),
    ('/Users/dewanshpoddar/.gemini/antigravity-ide/brain/432cdb25-24ca-4fa3-a798-5d43692bf116/calc_surrender_banner_1782599128563.png', '/Users/dewanshpoddar/PW/public/assets/hero-surrender.png'),
    ('/Users/dewanshpoddar/.gemini/antigravity-ide/brain/432cdb25-24ca-4fa3-a798-5d43692bf116/calc_analyzer_banner_1782599141400.png', '/Users/dewanshpoddar/PW/public/assets/hero-analyzer.png'),
    ('/Users/dewanshpoddar/.gemini/antigravity-ide/brain/432cdb25-24ca-4fa3-a798-5d43692bf116/calc_compare_banner_1782599154568.png', '/Users/dewanshpoddar/PW/public/assets/hero-compare.png'),
    ('/Users/dewanshpoddar/.gemini/antigravity-ide/brain/432cdb25-24ca-4fa3-a798-5d43692bf116/calc_nav_banner_1782599167472.png', '/Users/dewanshpoddar/PW/public/assets/hero-nav.png')
]

print("Starting banner assets copy...")
for src, dest in files:
    try:
        # Create destination directory if it doesn't exist
        os.makedirs(os.path.dirname(dest), exist_ok=True)
        shutil.copyfile(src, dest)
        print(f" -> Copied successfully to: {os.path.basename(dest)}")
    except Exception as e:
        print(f" -> Failed to copy {os.path.basename(src)}: {e}")
print("Assets setup completed.")
