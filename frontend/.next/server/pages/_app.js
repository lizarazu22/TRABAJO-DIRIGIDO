(() => {
var exports = {};
exports.id = 888;
exports.ids = [888];
exports.modules = {

/***/ 1957:
/***/ ((module) => {

// Exports
module.exports = {
	"navbar": "Navbar_navbar__tF5Gg",
	"logo": "Navbar_logo__8xjov",
	"navLinks": "Navbar_navLinks__5Ie_g",
	"logoutContainer": "Navbar_logoutContainer__g4BKd",
	"logoutButton": "Navbar_logoutButton__HV3_j"
};


/***/ }),

/***/ 268:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ _app)
});

// EXTERNAL MODULE: ./node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(5893);
// EXTERNAL MODULE: ./src/styles/globals.css
var globals = __webpack_require__(108);
// EXTERNAL MODULE: ./node_modules/next/link.js
var next_link = __webpack_require__(1664);
var link_default = /*#__PURE__*/__webpack_require__.n(next_link);
// EXTERNAL MODULE: external "react"
var external_react_ = __webpack_require__(6689);
// EXTERNAL MODULE: external "next/router"
var router_ = __webpack_require__(1853);
// EXTERNAL MODULE: ./src/styles/Navbar.module.css
var Navbar_module = __webpack_require__(1957);
var Navbar_module_default = /*#__PURE__*/__webpack_require__.n(Navbar_module);
// EXTERNAL MODULE: ./src/utils/carritoApi.js
var carritoApi = __webpack_require__(1239);
;// CONCATENATED MODULE: ./src/components/Navbar.js






const Navbar = ()=>{
    const [isLoggedIn, setIsLoggedIn] = (0,external_react_.useState)(false);
    const [cartCount, setCartCount] = (0,external_react_.useState)(0);
    const router = (0,router_.useRouter)();
    (0,external_react_.useEffect)(()=>{
        const checkAuth = ()=>{
            const user = JSON.parse(localStorage.getItem("user"));
            setIsLoggedIn(!!user);
            if (user) {
                (0,carritoApi/* obtenerCarrito */.Cj)(user._id).then((data)=>{
                    const totalItems = data.productos.reduce((sum, item)=>sum + item.cantidad, 0);
                    setCartCount(totalItems);
                }).catch(()=>setCartCount(0));
            } else {
                setCartCount(0);
            }
        };
        checkAuth();
        router.events.on("routeChangeComplete", checkAuth);
        return ()=>{
            router.events.off("routeChangeComplete", checkAuth);
        };
    }, [
        router
    ]);
    const handleLogout = ()=>{
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setIsLoggedIn(false);
        router.push("/login");
    };
    if (router.pathname === "/login" || router.pathname === "/signup") return null;
    return /*#__PURE__*/ (0,jsx_runtime.jsxs)("nav", {
        className: (Navbar_module_default()).navbar,
        children: [
            /*#__PURE__*/ jsx_runtime.jsx("div", {
                className: (Navbar_module_default()).logo,
                children: "Textiles Copacabana"
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsxs)("ul", {
                className: (Navbar_module_default()).navLinks,
                children: [
                    /*#__PURE__*/ jsx_runtime.jsx("li", {
                        children: /*#__PURE__*/ jsx_runtime.jsx((link_default()), {
                            href: "/",
                            children: "Inicio"
                        })
                    }),
                    /*#__PURE__*/ jsx_runtime.jsx("li", {
                        children: /*#__PURE__*/ jsx_runtime.jsx((link_default()), {
                            href: "/catalog",
                            children: "Cat\xe1logo"
                        })
                    }),
                    /*#__PURE__*/ jsx_runtime.jsx("li", {
                        children: /*#__PURE__*/ (0,jsx_runtime.jsxs)((link_default()), {
                            href: "/cart",
                            children: [
                                "Carrito ",
                                cartCount > 0 && `(${cartCount})`
                            ]
                        })
                    })
                ]
            }),
            isLoggedIn && /*#__PURE__*/ jsx_runtime.jsx("div", {
                className: (Navbar_module_default()).logoutContainer,
                children: /*#__PURE__*/ jsx_runtime.jsx("button", {
                    onClick: handleLogout,
                    className: (Navbar_module_default()).logoutButton,
                    children: "Cerrar Sesi\xf3n"
                })
            })
        ]
    });
};
/* harmony default export */ const components_Navbar = (Navbar);

;// CONCATENATED MODULE: ./src/components/Footer.js

const Footer = ()=>{
    return /*#__PURE__*/ jsx_runtime.jsx("footer", {
        style: {
            textAlign: "center",
            marginTop: "20px"
        },
        children: /*#__PURE__*/ jsx_runtime.jsx("p", {
            children: "\xa9 2025 Tienda Textil. Todos los derechos reservados."
        })
    });
};
/* harmony default export */ const components_Footer = (Footer);

;// CONCATENATED MODULE: ./src/pages/_app.js






function MyApp({ Component , pageProps  }) {
    const router = (0,router_.useRouter)();
    const [isAdmin, setIsAdmin] = (0,external_react_.useState)(false);
    (0,external_react_.useEffect)(()=>{
        if (false) {}
    }, [
        router.pathname
    ]);
    return /*#__PURE__*/ (0,jsx_runtime.jsxs)(jsx_runtime.Fragment, {
        children: [
            !isAdmin && /*#__PURE__*/ jsx_runtime.jsx(components_Navbar, {}),
            /*#__PURE__*/ jsx_runtime.jsx(Component, {
                ...pageProps
            }),
            router.pathname !== "/login" && /*#__PURE__*/ jsx_runtime.jsx(components_Footer, {})
        ]
    });
}
/* harmony default export */ const _app = (MyApp);


/***/ }),

/***/ 108:
/***/ (() => {



/***/ }),

/***/ 3280:
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/shared/lib/app-router-context.js");

/***/ }),

/***/ 4964:
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/shared/lib/router-context.js");

/***/ }),

/***/ 1751:
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/shared/lib/router/utils/add-path-prefix.js");

/***/ }),

/***/ 3938:
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/shared/lib/router/utils/format-url.js");

/***/ }),

/***/ 1109:
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/shared/lib/router/utils/is-local-url.js");

/***/ }),

/***/ 8854:
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/shared/lib/router/utils/parse-path.js");

/***/ }),

/***/ 3297:
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/shared/lib/router/utils/remove-trailing-slash.js");

/***/ }),

/***/ 7782:
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/shared/lib/router/utils/resolve-href.js");

/***/ }),

/***/ 9232:
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/shared/lib/utils.js");

/***/ }),

/***/ 1853:
/***/ ((module) => {

"use strict";
module.exports = require("next/router");

/***/ }),

/***/ 6689:
/***/ ((module) => {

"use strict";
module.exports = require("react");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, [893,664,239], () => (__webpack_exec__(268)));
module.exports = __webpack_exports__;

})();