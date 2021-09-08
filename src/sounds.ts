// @ts-nocheck
import { Settings } from './settings';

let zzfx, zzfxP, zzfxG, zzfxM, zzfxV, zzfxR, zzfxX
let u = undefined;

// zzfx() - the universal entry point -- returns a AudioBufferSourceNode
zzfx=(...t)=>zzfxP(zzfxG(...t));

// zzfxP() - the sound player -- returns a AudioBufferSourceNode
zzfxP=(...t)=>{let e=zzfxX.createBufferSource(),f=zzfxX.createBuffer(t.length,t[0].length,zzfxR);
			   t.map((d,i)=>f.getChannelData(i).set(d)),
			   e.buffer=f,
			   e.connect(zzfxX.destination),
			   e.start();
			   return e}

// zzfxG() - the sound generator -- returns an array of sample data
zzfxG=(q=1,k=.05,c=220,e=0,t=0,u=.1,r=0,F=1,v=0,z=0,w=0,A=0,l=0,B=0,x=0,G=0,d=0,y=1,m=0,C=0)=>{let b=2*Math.PI,H=v*=500*b/zzfxR**2,I=(0<x?1:-1)*b/4,D=c*=(1+2*k*Math.random()-k)*b/zzfxR,Z=[],g=0,E=0,a=0,n=1,J=0,K=0,f=0,p,h;e=99+zzfxR*e;m*=zzfxR;t*=zzfxR;u*=zzfxR;d*=zzfxR;z*=500*b/zzfxR**3;x*=b/zzfxR;w*=b/zzfxR;A*=zzfxR;l=zzfxR*l|0;for(h=e+m+t+u+d|0;a<h;Z[a++]=f)++K%(100*G|0)||(f=r?1<r?2<r?3<r?Math.sin((g%b)**3):Math.max(Math.min(Math.tan(g),1),-1):1-(2*g/b%2+2)%2:1-4*Math.abs(Math.round(g/b)-g/b):Math.sin(g),f=(l?1-C+C*Math.sin(2*Math.PI*a/l):1)*(0<f?1:-1)*Math.abs(f)**F*q*zzfxV*(a<e?a/e:a<e+m?1-(a-e)/m*(1-y):a<e+m+t?y:a<h-d?(h-a-d)/u*y:0),f=d?f/2+(d>a?0:(a<h-d?1:(h-a)/d)*Z[a-d|0]/2):f),p=(c+=v+=z)*Math.sin(E*x-I),g+=p-p*B*(1-1E9*(Math.sin(a)+1)%2),E+=p-p*B*(1-1E9*(Math.sin(a)**2+1)%2),n&&++n>A&&(c+=w,D+=w,n=0),!l||++J%l||(c=D,v=H,n=n||1);return Z}

// zzfxV - global volume
zzfxV=.3

// zzfxR - global sample rate
zzfxR=44100

// zzfxX - the common audio context
zzfxX=new(top.AudioContext||webkitAudioContext);


zzfxM=(n,f,t,e=125)=>{let l,o,z,r,g,h,x,a,u,c,d,i,m,p,G,M=0,R=[],b=[],j=[],k=0,q=0,s=1,v={},w=zzfxR/e*60>>2;for(;s;k++)R=[s=a=d=m=0],t.map((e,d)=>{for(x=f[e][k]||[0,0,0],s|=!!f[e][k],G=m+(f[e][0].length-2-!a)*w,p=d==t.length-1,o=2,r=m;o<x.length+p;a=++o){for(g=x[o],u=o==x.length+p-1&&p||c!=(x[0]||0)|g|0,z=0;z<w&&a;z++>w-99&&u?i+=(i<1)/99:0)h=(1-i)*R[M++]/2||0,b[r]=(b[r]||0)-h*q+h,j[r]=(j[r++]||0)+h*q+h;g&&(i=g%1,q=x[1]||0,(g|=0)&&(R=v[[c=x[M=0]||0,g]]=v[[c,g]]||(l=[...n[c]],l[2]*=2**((g-12)/12),g>0?zzfxG(...l):[])))}m=G});return[b,j]}

/*
class SoundEffects {
  coin() {

	zzfx(...[.6,u,1300,u,.05,.5,1,2,u,u,1300,.07,u,u,.1,u,u,.9]);
  }


  impact(speed) {
	const norm_speed = ((speed > Settings.maxSpeed ? Settings.maxSpeed : speed) - Settings.minImpactSoundSpeed)/(Settings.maxSpeed - Settings.minImpactSoundSpeed);
	const volume = norm_speed*(Settings.maxSoundImpactVolume - Settings.minSoundImpactVolume) + Settings.minSoundImpactVolume;

	zzfx(...[volume,u,200,u,u,u,u,5,u,-0.1,600,.3,u,8,u,u,u,.9,.1,.01]);
  }

  impact_tree() {

	zzfx(...[.5,u,304,.1,.3,u,5,.1,-46,u,u,u,u,u,-165]);
  }

  impact_foe() {

	zzfx(...[u,u,420,u,.02,.2,4,1.05,-9,u,2e3,.5,u,u,u,.5]);
  }

  impact_boss() {

	zzfx(...[.5,u,304,.1,.3,u,5,.1,-46,u,u,u,u,u,-165]);

	zzfx(...[u,u,418,0,.02,.2,4,1.15,-8.5,u,u,u,u,.7,u,.1]);
  }

  impact_bumper() {

	zzfx(...[u,u,224,.02,.02,.08,1,1.7,-13.9,u,u,u,u,u,6.7]);
  }

  impact_iron() {

	zzfx(...[.4,u,941,u,u,.4,4,.74,-222,u,u,u,u,.8,u,1]);
  }

  launcher() {

	zzfx(...[.7,u,1e3,u,.1,.8,u,u,u,u,100,.01,.03]);
  }

  paddle() {

	zzfx(...[.2,u,537,.02,.02,.22,1,1.59,-6.98,4.97]);

	zzfx(...[.5,u,150,.05,u,.05,u,1.3,u,u,u,u,u,3]);
  }
}
*/

const cowboy = [[[.5,0,196,.05,.5,.6,1],[.8,u,24.5,.2,.3,.7,u,.5,u,u,5,u,.1,u,u,u,u,.8,u,.2],[2,0,196,.02,.1,.4,1],[,0,49,u,u,.2,3,5]],[[[,-1,6,u,u,u,u,u,u,u,8,u,u,u,u,u,u,u,10,u,u,u,u,u,u,u,u,u,u,u,u,u,u,u],[,1,10,u,u,u,u,u,u,u,12,u,u,u,u,u,u,u,17,u,u,u,u,u,u,u,u,u,u,u,u,u,u,u],[,u,3,u,u,u,u,u,u,u,5,u,u,u,u,u,u,u,6,u,u,u,u,u,u,u,u,u,u,u,u,u,u,u],[2,u,u,u,u,u,u,u,u,u,u,u,u,u,u,u,u,u,u,u,u,u,u,u,u,u,u,15,15,u,13,u,10,u]],[[,-1,6,u,u,u,u,u,u,u,8,u,u,u,u,u,u,u,10,u,u,u,u,u,u,u,u,u,u,u,u,u,u,u],[,1,10,u,u,u,u,u,u,u,12,u,u,u,u,u,u,u,17,u,u,u,u,u,u,u,u,u,u,u,u,u,u,u],[,u,3,u,u,u,u,u,u,u,5,u,u,u,u,u,u,u,6,u,u,u,u,u,u,u,u,u,u,u,u,u,u,u],[2,u,8,u,u,u,u,u,u,u,3,u,3,u,10,u,u,u,8,u,6,u,u,u,u,u,u,15,15,u,13,u,10,u],[3,u,8,u,u,u,8,u,10,u,u,u,u,u,u,u,u,u,u,u,u,u,1,u,3,u,u,15,15,u,13,u,10,u]],[[,-1,6,u,u,u,u,u,u,u,8,u,u,u,u,u,u,u,10,u,u,u,u,u,u,u,u,u,u,u,u,u,u,u],[,1,10,u,u,u,u,u,u,u,12,u,u,u,u,u,u,u,17,u,u,u,u,u,u,u,u,u,u,u,u,u,u,u],[,u,3,u,u,u,u,u,u,u,5,u,u,u,u,u,u,u,6,u,u,u,u,u,u,u,u,u,u,u,u,u,u,u],[2,u,8,u,u,u,u,u,u,u,3,u,3,u,10,u,u,u,8,u,6,u,u,u,u,u,u,15,15,u,13,u,10,u],[3,u,8,u,u,u,8,u,10,u,u,u,1,3,u,u,8,u,1,3,u,u,1,u,3,u,u,15,15,u,13,u,10,u]]],[0,1,2,1,2],110,u];

const escape = [[[.8,0,22,u,u,.2,3,5],[.5,0,u,u,.2,.8,2,u,u,u,u,u,u,u,u,.02,.01],[.4,0,u,u,.1,.5,3],[2,0,45,u,u,.25,u,u,u,u,u,u,u,2,u,.1],[.3,0,880,u,u,.15,2,.2,-.1,-.15,9,.02,u,.1,.12,u,.06]],[[[,u,13,u,13,u,13,u,13,u,13,u,13,u,13,u,13,u,5,u,5,u,5,u,5,u,5,u,5,u,5,u,5,u],[1,1,19,u,u,u,u,u,u,u,u,u,u,u,u,u,u,u,17,u,u,u,u,u,u,u,u,u,u,u,u,u,u,u],[1,-1,13,u,u,u,u,u,u,u,u,u,u,u,u,u,u,u,12,u,u,u,u,u,u,u,u,u,u,u,u,u,u,u],[2,u,19,u,15,u,12,u,11,u,8,u,11,u,8,u,11,u,17,u,16,u,12,u,11,u,8,u,11,u,u,u,u,u]],[[,u,13,u,13,u,13,u,13,u,13,u,13,u,13,u,13,u,5,u,5,u,5,u,5,u,5,u,5,u,5,u,5,u],[1,1,19,u,u,u,u,u,u,u,u,u,u,u,u,u,u,u,17,u,u,u,u,u,u,u,u,u,u,u,u,u,u,u],[1,-1,13,u,u,u,u,u,u,u,u,u,u,u,u,u,u,u,12,u,u,u,u,u,u,u,u,u,u,u,u,u,u,u],[2,u,19,u,15,u,12,u,11,u,8,u,11,u,8,u,11,u,17,u,16,u,12,u,11,u,8,u,11,u,u,u,u,u],[3,u,13,13,13,13,13,u,u,u,13,13,13,13,13,u,u,u,13,13,13,13,13,u,u,u,13,13,13,13,13,u,u,u]],[[,u,13,u,13,u,13,u,13,u,13,u,13,u,13,u,13,u,5,u,5,u,5,u,5,u,5,u,5,u,5,u,5,u],[1,1,19,u,u,u,u,u,u,u,u,u,u,u,u,u,u,u,17,17,u,u,u,u,u,u,u,u,u,u,u,u,u,u],[1,-1,13,u,u,u,u,u,u,u,u,u,u,u,u,u,u,u,12,12,u,u,u,u,u,u,u,u,u,u,u,u,u,u],[2,u,19,u,15,u,12,u,11,u,8,u,11,u,8,u,11,u,17,u,16,u,12,u,11,u,8,u,11,u,u,u,u,u],[4,u,19,19,15,15,12,12,11,11,8,8,11,11,8,8,11,11,17,17,16,16,12,12,11,11,8,8,11,11,12,12,11,11]],[[,u,13,u,13,u,13,u,13,u,13,u,13,u,13,u,13,u,5,u,5,u,5,u,5,u,5,u,5,u,5,u,5,u],[1,1,19,u,u,u,u,u,u,u,u,u,u,u,u,u,u,u,17,17,u,u,u,u,u,u,u,u,u,u,u,u,u,u],[1,-1,13,u,u,u,u,u,u,u,u,u,u,u,u,u,u,u,12,12,u,u,u,u,u,u,u,u,u,u,u,u,u,u],[2,u,19,u,15,u,12,u,11,u,8,u,11,u,8,u,11,u,17,u,16,u,12,u,11,u,8,u,11,u,u,u,u,u],[4,u,19,19,15,15,12,12,11,11,8,8,11,11,8,8,11,11,17,17,16,16,12,12,11,11,8,8,11,11,12,12,11,11]]],[0,0,1,1,2,2,2,2],140,u];

let cowboy_song: any;
let escape_song: any;
let audio_node: any;

export function load() {
  cowboy_song = zzfxM(...cowboy);
  escape_song = zzfxM(...escape);
}

export function play_cowboy() {
  zzfxX.resume();
  audio_node = zzfxP(...cowboy_song);
  audio_node.loop = true;
}

export function play_escape() {
  audio_node = zzfxP(...escape_song);
  audio_node.loop = true;
}

export function stop_song() {
  audio_node.stop();
}

export function effect_enemy_death() {
	zzfx(...[.3,u,304,.1,.3,u,5,.1,-46,u,u,u,u,u,-165]);
	zzfx(...[.3,u,418,0,.02,.2,4,1.15,-8.5,u,u,u,u,.7,u,.1]);
}

export function effect_jump() {
  zzfx(...[0.3,,390,.05,.1,,1,1.7,2,,,,,,,,,.9]);
}

export function effect_shoot() {
  zzfx(...[0.1,,155,.02,.03,.07,4,1.2,-0.7,,,,,,,,,.88]);
}

export function effect_dash() {
  zzfx(...[0.5,,810,.04,.25,.2,3,.3,.5,.3,,,.2,.3,2.7,.3,,.6,.07,.4]);
}

export function effect_death() {
  zzfx(...[0.3,0,146.8324,.3,,.9,,,-12,.3,,,.4,4.1,1,.5,,.4,.99,.1]);
}

export function effect_mow() {
  zzfx(...[0.2,0,200,.3,,.15,1,0,.1,,,,,,,,.05,.2,,.2]);
  zzfx(...[0.5,0,200,.6,.1,.2,1,0,-0.1,,,,,,,,.01,,,.16]);
}

export function effect_transform() {
  zzfx(...[.1,,471,,.05,.4,4,,-7,,,,,1,60,,,.8,.05,.2]);
}

export function effect_game_over() {
  zzfx(...[,0,960,1,2,,,,-0.5,,-200,.2,,.3,,,1,,1]);
}


