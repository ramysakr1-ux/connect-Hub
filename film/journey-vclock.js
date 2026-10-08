(function(){
  var realNow = performance.now.bind(performance), realDate = Date.now, realRaf = window.requestAnimationFrame.bind(window), realCancel = window.cancelAnimationFrame.bind(window);
  var on = false, vt = 0, base = 0, dbase = 0, q = [], qid = 1;
  performance.now = function(){ return on ? vt : realNow(); };
  Date.now = function(){ return on ? dbase + vt : realDate(); };
  window.requestAnimationFrame = function(cb){ if (!on) return realRaf(cb); var id = qid++; q.push([id, cb]); return -id; };
  window.cancelAnimationFrame = function(id){ if (id < 0) { q = q.filter(function(x){ return x[0] !== -id; }); } else realCancel(id); };
  window.__vclockOn = function(){ vt = realNow(); dbase = realDate() - vt; on = true; };
  window.__vstep = function(ms){ vt += ms; var list = q; q = []; list.forEach(function(x){ try { x[1](vt); } catch (e) {} }); };
})();
