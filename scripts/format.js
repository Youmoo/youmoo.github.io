const { readFile,writeFile } = require("fs").promises;
(async () => {
  const data = await readFile(__dirname + "/rows.txt", "utf-8");

  const rows = data.split("\n");

  const formatted = rows.map(format);

  await writeFile(__dirname+'/formatted.txt',formatted.join('\n'),'utf-8');

  console.log('处理完了');

  function format(raw) {
    if (!/^\d{6}/.test(raw)) {
      return "";
    }

    const helper = {
      year: 10000,
      month: 1,
    };

    const split = [...new Set(raw.split(/\D+/))].sort().map((v) => ({
      year: +v.slice(0, 4),
      month: +v.slice(-2),
    }));

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
          p.groups.push({
            start: p.last.start,
            end: p.last.prev,
          });

          p.last = {
            start: v,
            prev: v,
          };
          return p;
        },
        {
          groups: [],
          last: null,
        }
      )
      .groups.map(({ start, end }) => {
        return (
          start.year +
          pad(start.month) +
          (start === end ? "" : "-" + end.year + pad(end.month))
        );
      });
    return range;
  }

  function pad(month) {
    return ("0" + month).slice(-2);
  }
})();
