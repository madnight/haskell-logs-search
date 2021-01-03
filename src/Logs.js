import "./App.css";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { HashLink as Link } from "react-router-hash-link";
import React, { useState, useEffect } from "react";
import mem from "mem";

function Logs() {
    const [items, setitems] = useState([]);
    const location = useLocation();
    const path = location.pathname;

    async function GetText(location) {
        const name = location.pathname.replace("/logs/", "");
        const res = await axios("https://logs.beuke.org/file/" + name);

        const randomColor = mem(() =>
            "#xxxxxx".replace(/x/g, (y) =>
                ((Math.random() * 16) | 0).toString(16)
            )
        );

        const arr = res.data.split("\n").flat(0).map((value, index) => {
            const i = index + 1;
            if (!value) return
            const log = value.split(" ");
            const timestamp = log[0];
            const name = log[1].slice(0,20);
            const text = log.slice(2).join(" ");
            return (
                <tr>
                        <Link to={"#" + i} id={i}>
                    <td>
                            <div
                                style={{
                                    color: "grey",
                                    display: "inline",
                                }}
                            >
                                {timestamp}
                            </div>
                    </td>
                        </Link>
                    <td>
                        <div
                            style={{
                                color: randomColor(name),
                                display: "inline",
                            }}
                        >
                            {name}
                        </div>
                    </td>
                    <td>
                        <div
                            style={{
                                color: "black",
                                display: "inline",
                            }}
                        >
                            {text}
                        </div>
                    </td>
                </tr>
            );
        });
        setitems(arr);

        // async loaded content does not scroll into view, neither with HashRouter
        // nor with any other Router type, hence we need to kick it manually
        if (location.hash) {
            const id = location.hash.replace("#", "");
            const element = document.getElementById(id);
            if (element) element.scrollIntoView({ block: "start" });
        }
    }

    useEffect(() => {
        GetText(location);
    }, [path]);

    return (
        <div className="Center">
            <table padding={5}>
                <div className="App">{items}</div>
            </table>
        </div>
    );
}

export default Logs;
