const Team = ({team, players}) => {
  return (
    <div className="flex flex-col text-center bg-secondary-500 rounded-xl shadow-lg overflow-hidden h-[200px]">
        <p className="text-4xl text-foreground font-bold bg-secondary-700 rounded-t-xl py-2 shadow-sm">
          {team}
        </p>
        <div className="flex-1 min-h-0 relative">
          <div className="absolute inset-0 overflow-y-auto">
            <div className="flex flex-wrap flex-row justify-center px-2">
              {players.map((m, index) => (
                <div key={`${m}-${index}`} className="bg-primary-200 m-2 rounded-lg w-28 p-2">
                  <p className="font-bold text-foreground overflow-hidden text-ellipsis whitespace-nowrap">{m}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
    </div>
  );
};

export default Team;
