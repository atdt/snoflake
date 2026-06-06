// Tiny CPU 3-D renderer for axis-aligned coloured boxes.
//
// The scene is a list of boxes { x, y, z, w, h, d, color }. Each
// frame the renderer:
//   1. computes the camera basis from yaw/pitch/distance,
//   2. emits up to six face quads per box (back-face culled by a
//      cheap half-space test against the camera position),
//   3. projects vertices through a pinhole camera,
//   4. sorts quads by mean camera-space depth (painter's algorithm),
//   5. fills each quad with a per-face Lambert-ish shade.
//
// Painter's algorithm is exact for non-overlapping axis-aligned
// boxes, which is what the shape grammar produces.

const COLORS = {
    PRK: [ 122, 168, 116 ],
    FND: [ 180, 173, 158 ],
    BRC: [ 173, 95, 70 ],
    GLS: [ 134, 195, 220 ],
    RUF: [ 82, 88, 96 ],
};

// Per-face shade: imagine the sun in the upper-front-right quadrant.
const SHADE = {
    PY: 1.00,
    MY: 0.28,
    PX: 0.85,
    MX: 0.55,
    PZ: 0.42,
    MZ: 0.88,
};

const WORLD_UP = { x: 0, y: 1, z: 0 };

function sub( a, b ) {
    return { x: a.x - b.x, y: a.y - b.y, z: a.z - b.z };
}

function dot( a, b ) {
    return a.x * b.x + a.y * b.y + a.z * b.z;
}

function cross( a, b ) {
    return {
        x: a.y * b.z - a.z * b.y,
        y: a.z * b.x - a.x * b.z,
        z: a.x * b.y - a.y * b.x,
    };
}

function norm( v ) {
    const len = Math.hypot( v.x, v.y, v.z ) || 1;
    return { x: v.x / len, y: v.y / len, z: v.z / len };
}

function shadeColor( rgb, brightness ) {
    return 'rgb(' +
        Math.round( rgb[0] * brightness ) + ',' +
        Math.round( rgb[1] * brightness ) + ',' +
        Math.round( rgb[2] * brightness ) + ')';
}

export function createScene( canvas ) {
    const ctx = canvas.getContext( '2d' );
    const boxes = [];

    let width = 1, height = 1;
    let yaw = -0.6, pitch = 0.55, distance = 150;
    let dirty = true;
    let auto = true;

    function resize() {
        const dpr = globalThis.devicePixelRatio || 1,
            rect = canvas.getBoundingClientRect();
        width = Math.max( rect.width, 1 );
        height = Math.max( rect.height, 1 );
        canvas.width = Math.round( width * dpr );
        canvas.height = Math.round( height * dpr );
        ctx.setTransform( dpr, 0, 0, dpr, 0, 0 );
        dirty = true;
    }

    function project( p, cam, right, up, forward, focal, hx, hy ) {
        const d = sub( p, cam ),
            x = dot( d, right ),
            y = dot( d, up ),
            z = dot( d, forward );
        if ( z < 0.5 ) return null;
        return { sx: focal * x / z + hx, sy: -focal * y / z + hy, cz: z };
    }

    function emitFace(
        faces,
        verts,
        cam,
        right,
        up,
        forward,
        focal,
        hx,
        hy,
        color,
    ) {
        const pts = [];
        let depth = 0;
        for ( let i = 0; i < 4; i++ ) {
            const p = project(
                verts[i],
                cam,
                right,
                up,
                forward,
                focal,
                hx,
                hy,
            );
            if ( !p ) return;
            pts.push( p );
            depth += p.cz;
        }
        faces.push( { pts, color, depth } );
    }

    function render() {
        const cp = Math.cos( pitch ),
            sp = Math.sin( pitch ),
            cyw = Math.cos( yaw ),
            syw = Math.sin( yaw ),
            cam = {
                x: distance * cp * syw,
                y: distance * sp,
                z: distance * cp * cyw,
            };
        const forward = norm( { x: -cam.x, y: -cam.y, z: -cam.z } ),
            right = norm( cross( forward, WORLD_UP ) ),
            up = cross( right, forward );

        const focal = Math.max( width, height ) * 1.05,
            hx = width / 2,
            hy = height / 2;

        // Soft sky gradient.
        const sky = ctx.createLinearGradient( 0, 0, 0, height );
        sky.addColorStop( 0, '#d3dde7' );
        sky.addColorStop( 1, '#eef2ee' );
        ctx.fillStyle = sky;
        ctx.fillRect( 0, 0, width, height );

        const faces = [];

        for ( const b of boxes ) {
            const x0 = b.x,
                y0 = b.y,
                z0 = b.z,
                x1 = b.x + b.w,
                y1 = b.y + b.h,
                z1 = b.z + b.d,
                rgb = COLORS[b.color] || [ 200, 200, 200 ];

            if ( cam.x > x1 ) {
                emitFace(
                    faces,
                    [
                        { x: x1, y: y0, z: z0 },
                        { x: x1, y: y0, z: z1 },
                        { x: x1, y: y1, z: z1 },
                        { x: x1, y: y1, z: z0 },
                    ],
                    cam,
                    right,
                    up,
                    forward,
                    focal,
                    hx,
                    hy,
                    shadeColor( rgb, SHADE.PX ),
                );
            }

            if ( cam.x < x0 ) {
                emitFace(
                    faces,
                    [
                        { x: x0, y: y0, z: z1 },
                        { x: x0, y: y0, z: z0 },
                        { x: x0, y: y1, z: z0 },
                        { x: x0, y: y1, z: z1 },
                    ],
                    cam,
                    right,
                    up,
                    forward,
                    focal,
                    hx,
                    hy,
                    shadeColor( rgb, SHADE.MX ),
                );
            }

            if ( cam.y > y1 ) {
                emitFace(
                    faces,
                    [
                        { x: x0, y: y1, z: z0 },
                        { x: x1, y: y1, z: z0 },
                        { x: x1, y: y1, z: z1 },
                        { x: x0, y: y1, z: z1 },
                    ],
                    cam,
                    right,
                    up,
                    forward,
                    focal,
                    hx,
                    hy,
                    shadeColor( rgb, SHADE.PY ),
                );
            }

            if ( cam.y < y0 ) {
                emitFace(
                    faces,
                    [
                        { x: x0, y: y0, z: z1 },
                        { x: x1, y: y0, z: z1 },
                        { x: x1, y: y0, z: z0 },
                        { x: x0, y: y0, z: z0 },
                    ],
                    cam,
                    right,
                    up,
                    forward,
                    focal,
                    hx,
                    hy,
                    shadeColor( rgb, SHADE.MY ),
                );
            }

            if ( cam.z > z1 ) {
                emitFace(
                    faces,
                    [
                        { x: x1, y: y0, z: z1 },
                        { x: x0, y: y0, z: z1 },
                        { x: x0, y: y1, z: z1 },
                        { x: x1, y: y1, z: z1 },
                    ],
                    cam,
                    right,
                    up,
                    forward,
                    focal,
                    hx,
                    hy,
                    shadeColor( rgb, SHADE.PZ ),
                );
            }

            if ( cam.z < z0 ) {
                emitFace(
                    faces,
                    [
                        { x: x0, y: y0, z: z0 },
                        { x: x1, y: y0, z: z0 },
                        { x: x1, y: y1, z: z0 },
                        { x: x0, y: y1, z: z0 },
                    ],
                    cam,
                    right,
                    up,
                    forward,
                    focal,
                    hx,
                    hy,
                    shadeColor( rgb, SHADE.MZ ),
                );
            }
        }

        faces.sort( ( a, b ) => b.depth - a.depth );

        for ( const f of faces ) {
            ctx.fillStyle = f.color;
            // Stroke with the same colour to hide hairline seams between
            // adjacent quads that share an edge.
            ctx.strokeStyle = f.color;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo( f.pts[0].sx, f.pts[0].sy );
            ctx.lineTo( f.pts[1].sx, f.pts[1].sy );
            ctx.lineTo( f.pts[2].sx, f.pts[2].sy );
            ctx.lineTo( f.pts[3].sx, f.pts[3].sy );
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        }
    }

    function tick() {
        if ( auto ) {
            yaw += 0.0035;
            dirty = true;
        }
        if ( dirty ) {
            render();
            dirty = false;
        }
        requestAnimationFrame( tick );
    }

    // Interaction: drag rotates, wheel zooms.
    let drag = null;
    const stopAuto = () => {
        auto = false;
    };

    canvas.addEventListener( 'pointerdown', ( e ) => {
        canvas.setPointerCapture( e.pointerId );
        drag = { x: e.clientX, y: e.clientY };
        stopAuto();
    } );
    canvas.addEventListener( 'pointermove', ( e ) => {
        if ( !drag ) return;
        const dx = e.clientX - drag.x,
            dy = e.clientY - drag.y;
        drag.x = e.clientX;
        drag.y = e.clientY;
        yaw -= dx * 0.008;
        pitch = Math.max(
            0.05,
            Math.min( Math.PI / 2 - 0.05, pitch + dy * 0.008 ),
        );
        dirty = true;
    } );
    const endDrag = () => {
        drag = null;
    };
    canvas.addEventListener( 'pointerup', endDrag );
    canvas.addEventListener( 'pointercancel', endDrag );

    canvas.addEventListener( 'wheel', ( e ) => {
        e.preventDefault();
        distance = Math.max(
            60,
            Math.min( 360, distance * ( 1 + e.deltaY * 0.001 ) ),
        );
        dirty = true;
        stopAuto();
    }, { passive: false } );

    globalThis.addEventListener( 'resize', resize );

    resize();
    requestAnimationFrame( tick );

    return {
        addBox( b ) {
            boxes.push( b );
            dirty = true;
        },
        clear() {
            boxes.length = 0;
            dirty = true;
        },
        count() {
            return boxes.length;
        },
        resetCamera() {
            yaw = -0.6;
            pitch = 0.55;
            distance = 150;
            auto = true;
            dirty = true;
        },
    };
}
