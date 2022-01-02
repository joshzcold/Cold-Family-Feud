export default function TeamName(props) {
  return (
    <div
      class="text-3xl flex flex-col text-center space-y-2"
      style={{
        minWidth: 0,
      }}
    >
      <div class="bg-gradient-to-tr from-blue-900 to-blue-500">
        <p
          class="p-5 uppercase text-white"
          style={{
            fontWeight: 600,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            flex: 1,
            textShadow: "1px 2px 4px black",
          }}
        >
          {props.game.teams[props.team].name}
        </p>
      </div>
      <div class="flex justify-center flex-row text-center space-x-2">
        {Array(props.game.teams[props.team].mistakes).fill(
          <div class="flex-shrink">
            <img src="x.png" />
          </div>
        )}
      </div>
    </div>
  );
}
