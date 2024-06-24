interface Props {
  title: string;
  data: Map<number, string>;
  animatedData: Set<number>;
  colorClass: string;
  limit?: number;
}

const Trades = ({
  title,
  data,
  animatedData,
  colorClass,
  limit = 5,
}: Props) => {
  return (
    <div className="flex flex-col">
      <h2 className={`font-bold text-${colorClass}-800`}>
        {title.toUpperCase()}
      </h2>

      <div className={`border border-${colorClass}-800 p-4 h-full mt-2`}>
        <div className="flex justify-between gap-3">
          <span className="font-bold">Price</span>
          <span className="font-bold">Quantity</span>
        </div>

        <div className="flex flex-col mt-2">
          {!data.size && (
            <div
              className={`text-center w-full bg-${colorClass}-800 text-white p-20`}
            >
              Loading
            </div>
          )}
          {data &&
            Array.from(data.entries())
              .slice(0, limit)
              .map((element) => (
                <div
                  key={`${element[0]}-${element[1]}`}
                  className={`flex justify-between gap-3 hover:bg-${colorClass}-300 hover:cursor-default ${
                    animatedData.has(element[0])
                      ? `text-${colorClass}-800 font-bold`
                      : ''
                  } `}
                >
                  <div>{element[0]}</div>
                  <div>{element[1]}</div>
                </div>
              ))}
        </div>
      </div>
    </div>
  );
};

export default Trades;
