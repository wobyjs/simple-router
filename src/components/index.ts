
//TODO: ScrollRestoration

/* IMPORT */

// Register router FIRST so its SYMBOL_CONTEXT_WRAP is set before link/route upgrade
import Router from './router'
import Link from './link'
import Navigate from './navigate'
import Route from './route'

/* EXPORT */

export { Link, Navigate, Route, Router }
