"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseGoogleMapsLatLng = parseGoogleMapsLatLng;
function parseGoogleMapsLatLng(url) {
    const raw = (url ?? '').trim();
    if (!raw)
        return null;
    try {
        // Common patterns:
        // - https://www.google.com/maps/@LAT,LNG,15z
        // - ...!3dLAT!4dLNG...
        // - https://maps.google.com/?q=LAT,LNG
        const at = raw.match(/@(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)/);
        if (at) {
            const latitude = Number(at[1]);
            const longitude = Number(at[2]);
            if (Number.isFinite(latitude) && Number.isFinite(longitude)) {
                return { latitude, longitude };
            }
        }
        const bang = raw.match(/!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/);
        if (bang) {
            const latitude = Number(bang[1]);
            const longitude = Number(bang[2]);
            if (Number.isFinite(latitude) && Number.isFinite(longitude)) {
                return { latitude, longitude };
            }
        }
        const parsed = new URL(raw);
        const q = parsed.searchParams.get('q') || parsed.searchParams.get('query');
        if (q) {
            const m = q.match(/(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)/);
            if (m) {
                const latitude = Number(m[1]);
                const longitude = Number(m[2]);
                if (Number.isFinite(latitude) && Number.isFinite(longitude)) {
                    return { latitude, longitude };
                }
            }
        }
        // Some share links include a `ll` param.
        const ll = parsed.searchParams.get('ll');
        if (ll) {
            const m = ll.match(/(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)/);
            if (m) {
                const latitude = Number(m[1]);
                const longitude = Number(m[2]);
                if (Number.isFinite(latitude) && Number.isFinite(longitude)) {
                    return { latitude, longitude };
                }
            }
        }
        // Place URLs can contain `?api=1&query=LAT,LNG` handled above, or `center=LAT,LNG`.
        const center = parsed.searchParams.get('center');
        if (center) {
            const m = center.match(/(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)/);
            if (m) {
                const latitude = Number(m[1]);
                const longitude = Number(m[2]);
                if (Number.isFinite(latitude) && Number.isFinite(longitude)) {
                    return { latitude, longitude };
                }
            }
        }
    }
    catch {
        // ignore parse errors
    }
    return null;
}
