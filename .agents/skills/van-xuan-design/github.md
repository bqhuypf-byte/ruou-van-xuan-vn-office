repo: bqhuypf-byte/ruou-van-xuan-vn-office
branch: main

## Last sync
date: 2026-08-20T05:15:34Z

### Updated in this project
- Extracted color/type/spacing/radius/shadow tokens from `DESIGN_TOKENS.md` + `shared/components/ui`
- Built Core (Button, Badge, Input, Modal, Spinner) and Layout (Footer, PromoBand, UserMenu, CartBadge, CategoryNavMenu) components
- Built Storefront (Home/Product/Cart) and Admin CMS (Products/Categories/Settings) click-through UI kits

## Screen map
| Project screen | Repo source |
|---|---|
| ui_kits/storefront/HomePage.jsx | frontend-react-hoidanit/src/features/product/pages/HomePage.tsx |
| ui_kits/storefront/ProductViewPage.jsx | frontend-react-hoidanit/src/features/product/pages/ProductViewPage.tsx |
| ui_kits/storefront/CartPage.jsx | frontend-react-hoidanit/src/features/cart/pages/CartPage.tsx |
| ui_kits/admin/ProductsScreen.jsx | frontend-react-hoidanit/src/features/product/pages/ProductsPage.tsx, ProductTable.tsx, ProductFormModal.tsx |
| ui_kits/admin/CategoriesScreen.jsx | frontend-react-hoidanit/src/features/product/pages/CategoriesPage.tsx |
| ui_kits/admin/SiteSettingsScreen.jsx | frontend-react-hoidanit/src/features/home/pages/SiteSettingsPage.tsx |
| components/core/* | frontend-react-hoidanit/src/shared/components/ui/* |
| components/layout/Footer, PromoBand, UserMenu | frontend-react-hoidanit/src/shared/components/layout/* |
| components/layout/CartBadge | frontend-react-hoidanit/src/features/cart/components/CartBadge.tsx |
| components/layout/CategoryNavMenu | frontend-react-hoidanit/src/features/product/components/CategoryNavMenu.tsx |
