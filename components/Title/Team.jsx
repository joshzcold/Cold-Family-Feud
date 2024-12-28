const Team = ({team, players}) => {
  return (
    <>
      <div className="flex flex-row text-center bg-secondary-500 rounded-xl shadow-lg">
        <div className="flex-grow">
          <p className="text-4xl flex-grow text-foreground font-bold bg-secondary-700 rounded-t-xl py-3 shadow-sm">
            {team}
          </p>
          <div className="flex flex-wrap flex-row justify-center">
            {players.map((m) => (
              <div className="bg-primary-200 m-2 rounded-lg w-32 p-2">
                <p className="font-bold text-foreground overflow-hidden text-ellipsis whitespace-nowrap">{m}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Team;
