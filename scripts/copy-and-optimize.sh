#!/bin/bash
# Re-run from the root of the project (/Users/dewanshpoddar/PW)

echo "Starting image copy and optimization..."

# Define source images in .gemini directory
LIFE="/Users/dewanshpoddar/.gemini/antigravity-ide/brain/2dc1d3d3-c62f-4de7-85f3-1cdf64af9b3c/life_insurance_hero_1782415255531.png"
HEALTH_INS="/Users/dewanshpoddar/.gemini/antigravity-ide/brain/2dc1d3d3-c62f-4de7-85f3-1cdf64af9b3c/health_insurance_hero_1782417033495.png"
TERM="/Users/dewanshpoddar/.gemini/antigravity-ide/brain/2dc1d3d3-c62f-4de7-85f3-1cdf64af9b3c/term_life_hero_1782417049846.png"
CHILD="/Users/dewanshpoddar/.gemini/antigravity-ide/brain/2dc1d3d3-c62f-4de7-85f3-1cdf64af9b3c/child_planning_hero_1782417066124.png"
RETIRE="/Users/dewanshpoddar/.gemini/antigravity-ide/brain/2dc1d3d3-c62f-4de7-85f3-1cdf64af9b3c/retirement_hero_1782417081653.png"
TAX="/Users/dewanshpoddar/.gemini/antigravity-ide/brain/2dc1d3d3-c62f-4de7-85f3-1cdf64af9b3c/tax_planning_hero_1782417095445.png"
CRIT="/Users/dewanshpoddar/.gemini/antigravity-ide/brain/2dc1d3d3-c62f-4de7-85f3-1cdf64af9b3c/critical_illness_hero_1782417110483.png"
CANCER="/Users/dewanshpoddar/.gemini/antigravity-ide/brain/2dc1d3d3-c62f-4de7-85f3-1cdf64af9b3c/cancer_cover_hero_1782417126863.png"
KEYMAN="/Users/dewanshpoddar/.gemini/antigravity-ide/brain/2dc1d3d3-c62f-4de7-85f3-1cdf64af9b3c/keyman_insurance_hero_1782417142225.png"
GROUP="/Users/dewanshpoddar/.gemini/antigravity-ide/brain/2dc1d3d3-c62f-4de7-85f3-1cdf64af9b3c/group_health_hero_1782417156398.png"
ACCIDENT="/Users/dewanshpoddar/.gemini/antigravity-ide/brain/2dc1d3d3-c62f-4de7-85f3-1cdf64af9b3c/personal_accident_hero_1782417186929.png"
PROTECT_HUB="/Users/dewanshpoddar/.gemini/antigravity-ide/brain/2dc1d3d3-c62f-4de7-85f3-1cdf64af9b3c/protection_hero_1782417203472.png"
SAVINGS_HUB="/Users/dewanshpoddar/.gemini/antigravity-ide/brain/2dc1d3d3-c62f-4de7-85f3-1cdf64af9b3c/savings_hero_1782417220797.png"
HEALTH_HUB="/Users/dewanshpoddar/.gemini/antigravity-ide/brain/2dc1d3d3-c62f-4de7-85f3-1cdf64af9b3c/health_hero_1782417239639.png"

node scripts/optimize-image.js "$LIFE" "life-insurance"
node scripts/optimize-image.js "$HEALTH_INS" "health-insurance"
node scripts/optimize-image.js "$TERM" "term-life"
node scripts/optimize-image.js "$CHILD" "child-planning"
node scripts/optimize-image.js "$RETIRE" "retirement"
node scripts/optimize-image.js "$TAX" "tax-planning"
node scripts/optimize-image.js "$CRIT" "critical-illness"
node scripts/optimize-image.js "$CANCER" "cancer-cover"
node scripts/optimize-image.js "$KEYMAN" "keyman-insurance"
node scripts/optimize-image.js "$GROUP" "group-health"
node scripts/optimize-image.js "$ACCIDENT" "personal-accident"
node scripts/optimize-image.js "$PROTECT_HUB" "protection"
node scripts/optimize-image.js "$SAVINGS_HUB" "savings"
node scripts/optimize-image.js "$HEALTH_HUB" "health"

echo "All images optimized and copied!"
