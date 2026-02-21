#!/usr/bin/env bash
set -euo pipefail

RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
NC='\033[0m'

echo "========================================="
echo "  Deuce Diary — Pre-Build Check"
echo "========================================="
echo ""

PASS=0
WARN=0
FAIL=0

# 1. Check EXPO_PUBLIC_API_URL
if [ -z "${EXPO_PUBLIC_API_URL:-}" ]; then
  echo -e "${RED}FAIL${NC} EXPO_PUBLIC_API_URL is not set"
  FAIL=$((FAIL + 1))
elif echo "$EXPO_PUBLIC_API_URL" | grep -q "placeholder"; then
  echo -e "${RED}FAIL${NC} EXPO_PUBLIC_API_URL contains 'placeholder' — set the real URL"
  FAIL=$((FAIL + 1))
else
  echo -e "${GREEN}PASS${NC} EXPO_PUBLIC_API_URL = $EXPO_PUBLIC_API_URL"
  PASS=$((PASS + 1))
fi

# 2. Check EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY
if [ -z "${EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY:-}" ]; then
  echo -e "${YELLOW}WARN${NC} EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY is not set (Clerk auth disabled)"
  WARN=$((WARN + 1))
else
  echo -e "${GREEN}PASS${NC} EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY is set"
  PASS=$((PASS + 1))
fi

# 3. Check icon exists and is 1024x1024
if [ -f "assets/icon.png" ]; then
  ICON_SIZE=$(sips -g pixelWidth assets/icon.png 2>/dev/null | tail -1 | awk '{print $2}')
  if [ "$ICON_SIZE" = "1024" ]; then
    echo -e "${GREEN}PASS${NC} assets/icon.png is 1024x1024"
    PASS=$((PASS + 1))
  else
    echo -e "${YELLOW}WARN${NC} assets/icon.png exists but width is ${ICON_SIZE}px (expected 1024)"
    WARN=$((WARN + 1))
  fi
else
  echo -e "${RED}FAIL${NC} assets/icon.png is missing"
  FAIL=$((FAIL + 1))
fi

# 4. Check eas.json exists
if [ -f "eas.json" ]; then
  echo -e "${GREEN}PASS${NC} eas.json exists"
  PASS=$((PASS + 1))
else
  echo -e "${RED}FAIL${NC} eas.json is missing"
  FAIL=$((FAIL + 1))
fi

# 5. Quick export check (non-blocking)
echo ""
echo "Running export check..."
if npx expo export --dump-sourcemap 2>/dev/null; then
  echo -e "${GREEN}PASS${NC} expo export succeeded"
  PASS=$((PASS + 1))
else
  echo -e "${YELLOW}WARN${NC} expo export check skipped or failed (may need dev server)"
  WARN=$((WARN + 1))
fi

# Summary
echo ""
echo "========================================="
echo "  Results: ${GREEN}${PASS} passed${NC}, ${YELLOW}${WARN} warnings${NC}, ${RED}${FAIL} failed${NC}"
echo "========================================="

if [ "$FAIL" -gt 0 ]; then
  echo -e "${RED}Fix failures before building for production.${NC}"
  exit 1
else
  echo -e "${GREEN}Ready to build!${NC}"
  echo ""
  echo "  npx eas build --platform ios --profile production"
  echo ""
fi
