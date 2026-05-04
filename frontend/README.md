User clicks "Add"
        ↓
ProductCard calls addToCart()
        ↓
AppContext updates cartItems state
        ↓
React re-renders ALL consumers
        ↓
ProductCard sees new quantity
        ↓
UI switches from "Add" → counter

// move this geolocation key towards backend to apply rate limit
User clicks "Use Current Location"
        ↓
Browser Geolocation API
        ↓
You get latitude & longitude
        ↓
Call Nominatim reverse API
        ↓
You get city/state/street
        ↓
Auto-fill form
