import "./App.css";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { HashLink as Link } from "react-router-hash-link";
import React, { useState, useEffect } from "react";

function Logs() {
    const [items, setitems] = useState([]);
    const location = useLocation();

    async function GetText(location) {
        const name = location.pathname.replace("/logs/", "");
        const res = await axios("http://localhost:3000/file/" + name);
        const arr = [];
        for (const [index, value] of res.data.split("\n").entries()) {
            const i = index + 1;
            arr.push(
                <Link to={"#" + i} id={i}>
                    {value}
                    <br />
                </Link>
            );
        }

        setitems(arr);

        const hash = location.hash;
        if (hash) {
            const id = hash.replace("#", "");
            const element = document.getElementById(id);
            if (element) element.scrollIntoView({ block: "start" });
        }
    }

    useEffect(() => {
        GetText(location);
    }, [location]);

    return (
        <div className="Center">
            <div className="App">{items}</div>
        </div>
    );
}

export default Logs;
