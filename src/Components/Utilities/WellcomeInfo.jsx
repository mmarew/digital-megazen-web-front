import React from "react";
import { ConsumeableContext } from "../Body/UserContext/UserContext";
import wellcomeInfoCss from "./WellcomeInfo.module.css";
function WellcomeInfo({ Message }) {
  const { ownersName } = ConsumeableContext();
  return (
    <div className={wellcomeInfoCss.wrapper}>
      <span className={wellcomeInfoCss.usersName}>
        Hello {ownersName ? ownersName : " User "},
      </span>
      <span className={wellcomeInfoCss.welcomeMessage}>{Message}</span>
      <p className={wellcomeInfoCss.dateDisplayer}>
        Today is {new Date().toDateString()}, we wish you a good day with us.
      </p>
    </div>
  );
}

export default WellcomeInfo;
