import React, { useEffect } from "react";
import helpStyles from "../CSS/Help.module.css";
import { Outlet, useNavigate } from "react-router-dom";
import LeftSideBusiness from "../Components/LeftSide/LeftSideBusiness";
import { Button } from "@mui/material";
// 250,250,250
let HELP_API = [
  {
    embededTo: (
      <iframe
        width="300"
        height="315"
        src="https://www.youtube.com/embed/FQ81qC--q6k?si=Spo9U1qSUdxv5U2K"
        title="YouTube video player"
        frameborder="0"
        allow="fullscreen; accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerpolicy="strict-origin-when-cross-origin"
        allowfullscreen
      ></iframe>
    ),
    Description: "How to register, login and forgot password",
    url: "https://www.youtube.com/watch?v=FQ81qC--q6k",
  },
  {
    embededTo: (
      <iframe
        width="300"
        height="315"
        src="https://www.youtube.com/embed/NWCT9229vYM?si=xAmfL2Meq-lzO0BC"
        title="YouTube video player"
        frameborder="0"
        allow="fullscreen; accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerpolicy="strict-origin-when-cross-origin"
        allowfullscreen
      ></iframe>
    ),
    Description: "How to create business",
    url: "https://www.youtube.com/watch?v=NWCT9229vYM",
  },
  {
    embededTo: (
      <iframe
        width="300"
        height="315"
        src="https://www.youtube.com/embed/DnaoLIWV1ls?si=IfXfR6YLmED3SUl8"
        title="YouTube video player"
        frameborder="0"
        allow="fullscreen; accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerpolicy="strict-origin-when-cross-origin"
        allowfullscreen
      ></iframe>
    ),
    Description: "how to add items",
    url: "https://www.youtube.com/watch?v=DnaoLIWV1ls",
  },
  {
    embededTo: (
      <iframe
        width="300"
        height="315"
        src="https://www.youtube.com/embed/WLGR7dZKGZw?si=aIZaxiqX7vikxiif"
        title="YouTube video player"
        frameborder="0"
        allow="fullscreen; accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerpolicy="strict-origin-when-cross-origin"
        allowfullscreen
      ></iframe>
    ),
    Description: "how to make transaction registration",
    url: "https://www.youtube.com/watch?v=WLGR7dZKGZw",
  },
  {
    embededTo: (
      <iframe
        width="300"
        height="315"
        src="https://www.youtube.com/embed/7s9FFZZ78cg?si=sUf-6NP_9wAdYZbu"
        title="YouTube video player"
        frameborder="0"
        allow="fullscreen; accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerpolicy="strict-origin-when-cross-origin"
        allowfullscreen
      ></iframe>
    ),
    Description: "how to make follow up on credit sales",
    url: "https://www.youtube.com/watch?v=7s9FFZZ78cg",
  },
  {
    embededTo: (
      <iframe
        width="300"
        height="315"
        src="https://www.youtube.com/embed/WoTu1XoEV-E?si=WaRYFx1D8FfXyl_-"
        title="YouTube video player"
        frameborder="0"
        allow="fullscreen; accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerpolicy="strict-origin-when-cross-origin"
        allowfullscreen
      ></iframe>
    ),
    Description: "how to add employees in your business",
    url: "https://www.youtube.com/watch?v=WoTu1XoEV-E",
  },
  {
    url: "https://www.youtube.com/watch?v=1uOt58ZH51U",
    embededTo: (
      <iframe
        width="300"
        height="315"
        src="https://www.youtube.com/embed/1uOt58ZH51U?si=3CsGuunJvlmuBRjQ"
        title="YouTube video player"
        frameborder="0"
        allow="fullscreen; fullscreen; accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerpolicy="strict-origin-when-cross-origin"
      ></iframe>
    ),
    Description: "How to see inventory in your business",
  },
];
function Help() {
  let navigate = useNavigate();
  let goTo = (Path) => {
    window.open(Path, "_blank");
  };
  let storeToken = localStorage.getItem("storeToken");

  return (
    <div
      style={{
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <div className={helpStyles.helpContainer}>
        {window.innerWidth > 768 && (
          <div className={helpStyles.LeftHelpContainer}>
            <LeftSideBusiness className={helpStyles.LeftSideBusiness} />
          </div>
        )}
        <div className={helpStyles.helpMiddelContainer}>
          <br />
          <h3> Manuals on how to use stock managements</h3>
          <br />
          <ul className={helpStyles.helpUL}>
            {HELP_API.map((item, index) => {
              return (
                <li key={index}>
                  {item.embededTo}
                  <div className={helpStyles.TitleOfHelp}>
                    {item.Description}
                  </div>
                  <Button
                    sx={{ display: "block", margin: "auto" }}
                    onClick={() => goTo(item.url)}
                  >
                    learn More{" "}
                  </Button>
                </li>
              );
            })}
          </ul>
          <Outlet />
          <h3>More help on contact</h3>
          <ul className={helpStyles.helpContact}>
            <li></li>
            <li>
              Phone &nbsp; <a href="tel:+251922112480">+251922112480</a>
            </li>

            <li>
              Message me on &nbsp;
              <a href="https://wa.me/+251922112480"> WhatsApp</a>
            </li>
            <li>
              Message me on &nbsp;<a href="tel:+251922112480"> Telegram</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
export default Help;
