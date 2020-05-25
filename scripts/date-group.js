const raw = `201703,201705 ,201706. 201707,201708, 201803 ,201810,201811,201812 ,201904,201905,201906,201910,201704,201806 ,201901,201902 ,201903.201905,201911,201912,202001,201711.201801,201804,201807 ,201808,201809,201907 ,201908,201909,202002`;

const helper = { year: 10000, month: 1 };

const split = raw
  .split(/\D+/)
  .sort()
  .map((v) => ({ year: +v.slice(0, 4), month: +v.slice(-2) }));


  split.push(helper);


const range = split
  .reduce(
    (p, v, i) => {
      if (i === 0) {
        p.last = {
          start: v,
          prev: v,
        };
        return p;
      }

      const { start, prev } = p.last;

      if (prev.year === v.year && prev.month + 1 === v.month) {
        // 可以连上
        p.last.prev = v;
        return p;
      }

      // 断开了
      p.groups.push({ start: p.last.start, end: p.last.prev });

      p.last = {
        start: v,
        prev: v,
      };
      return p;
    },
    { groups: [], last: null }
  )
  .groups.map(({ start, end }) => {
    return (
      start.year +
      pad(start.month) +
      (start === end ? "" : "-" + end.year + pad(end.month))
    );
  });

console.log(range.join(','));

function pad(month) {
  return ("0" + month).slice(-2);
}
