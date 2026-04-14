import Switch from "react-switch";

const SwitchToggle = ({ id, title, handleProcess, processOption }) => {
  return (
    <>
      <div className={title ? "mb-3" : ""}>
        <div className="flex flex-wrap items-center">
          {title && (
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
              {title}
            </label>
          )}


          <Switch
            id={id || title || ""}
            onChange={handleProcess}
            checked={processOption || false}
            className="react-switch md:ml-0 ml-3"
            uncheckedIcon={
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                  fontSize: 12,
                  fontWeight: "bold",
                  color: "white",
                  paddingRight: 8,
                }}
              >
                No
              </div>
            }
            width={75}
            height={30}
            handleDiameter={24}
            offColor="#EF4444"
            onColor="#10B981"
            offHandleColor="#fff"
            onHandleColor="#fff"
            boxShadow="0px 1px 5px rgba(0, 0, 0, 0.2)"
            activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
            checkedIcon={
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                  fontSize: 12,
                  fontWeight: "bold",
                  color: "white",
                  paddingLeft: 8,
                }}
              >
                Yes
              </div>
            }
          />
        </div>
      </div>
    </>
  );
};

export default SwitchToggle;
