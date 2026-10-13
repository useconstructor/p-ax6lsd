// Reproducible OFL derivative. Run: node scripts/build-poster-font.mjs
// Narrow: MESA_CONDENSED=1 node scripts/build-poster-font.mjs
import ot from 'opentype.js';
import fs from 'node:fs';
import Clipper from 'clipper-lib';
const source=ot.parse(Uint8Array.from(fs.readFileSync('public/fonts/Norwester-Regular.ttf')).buffer);
const polygon=points=>{const p=new ot.Path();p.moveTo(...points[0]);for(const point of points.slice(1))p.lineTo(...point);p.close();return p};
const outer=[[252,0],[772,0],[922,150],[922,1488],[772,1638],[252,1638],[102,1488],[102,150]];
const inner=[[422,285],[422,1353],[452,1383],[572,1383],[602,1353],[602,285],[572,255],[452,255]];
// C has an open right side at the middle; square terminals and restrained bevels.
const cp=[[252,0],[772,0],[922,150],[922,530],[642,530],[642,298],[600,255],[450,255],[408,298],[408,1340],[450,1383],[600,1383],[642,1340],[642,1108],[922,1108],[922,1488],[772,1638],[252,1638],[102,1488],[102,150]];
const sp=[[252,0],[772,0],[922,150],[922,630],[381,1050],[381,1338],[426,1383],[598,1383],[643,1338],[643,1108],[922,1108],[922,1488],[772,1638],[252,1638],[102,1488],[102,980],[643,560],[643,300],[598,255],[426,255],[381,300],[381,530],[102,530],[102,150]];
let glyphs=[];
for(let i=0;i<source.glyphs.length;i++){
 const g=source.glyphs.get(i);let path=new ot.Path();let previous;
 for(const cmd of g.path.commands){if(cmd.type==='Q'){// Replace round bends with straight restrained corner facets.
   const x=(previous.x+2*cmd.x1+cmd.x)/4,y=(previous.y+2*cmd.y1+cmd.y)/4;path.lineTo(x,y);path.lineTo(cmd.x,cmd.y);
  }else path.commands.push({...cmd});if(cmd.x!==undefined)previous=cmd;
 }
 if(g.unicode===79){path=polygon(outer);path.commands.push(...polygon(inner).commands)}
 if(g.unicode===67)path=polygon(cp);
 if(g.unicode===83)path=polygon(sp);
 // Increase the ink weight with mitered vector offsets, preserving counters.
 let contours=[],contour=[];for(const cmd of path.commands){if(cmd.type==='M'){contour=[];contours.push(contour)}if(cmd.x!==undefined)contour.push({X:cmd.x,Y:cmd.y})}
 const offset=new Clipper.ClipperOffset(2,.25);offset.AddPaths(contours,Clipper.JoinType.jtMiter,Clipper.EndType.etClosedPolygon);let expanded=[];offset.Execute(expanded,48);path=new ot.Path();for(const points of expanded){if(!points.length)continue;path.moveTo(points[0].X,points[0].Y);for(const point of points.slice(1))path.lineTo(point.X,point.Y);path.close()}
 // A single designed condensed outline across the font, never CSS glyph transforms.
 for(const cmd of path.commands)for(const key of ['x','x1','x2'])if(cmd[key]!==undefined)cmd[key]=Math.round(cmd[key]*(process.env.MESA_CONDENSED? .66:.78));
 glyphs.push(new ot.Glyph({name:g.unicode===0?'.null':g.name,unicode:g.unicode,unicodes:g.unicodes,advanceWidth:Math.round(g.advanceWidth*(process.env.MESA_CONDENSED? .66:.78)),path}));
}
// Spanish capitals use the same base outlines plus hand-drawn vector accents.
for(const [letter,base] of [['Á','A'],['É','E'],['Í','I'],['Ó','O'],['Ú','U'],['Ñ','N']]){const original=glyphs.find(g=>g.unicode===base.charCodeAt(0));const path=new ot.Path();path.commands=original.path.commands.map(c=>({...c}));const mid=original.advanceWidth/2;const accent=letter==='Ñ'?[[mid-145,1730],[mid-75,1850],[mid+35,1780],[mid+125,1850],[mid+160,1760],[mid+75,1680],[mid-45,1750],[mid-115,1680]]:[[mid-70,1690],[mid+25,1890],[mid+190,1890],[mid+35,1690]];path.commands.push(...polygon(accent).commands);glyphs.push(new ot.Glyph({name:'uni'+letter.charCodeAt(0).toString(16),unicode:letter.charCodeAt(0),advanceWidth:original.advanceWidth,path}))}
const font=new ot.Font({familyName:process.env.MESA_CONDENSED?'Mesa Letterpress Narrow':'Mesa Letterpress',styleName:'Regular',unitsPerEm:2048,ascender:1792,descender:-355,glyphs});
fs.writeFileSync(process.env.MESA_CONDENSED?'public/fonts/MesaLetterpress-Narrow.otf':'public/fonts/MesaLetterpress-Regular.otf',Buffer.from(font.toArrayBuffer()));
