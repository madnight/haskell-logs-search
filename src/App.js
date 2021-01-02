import "./App.css";
import axios from "axios";
import _ from "lodash";
import { useLocation } from "react-router-dom";
import { useHistory } from "react-router-dom";
import Highlighter from "react-highlight-words";
import React, { useState, useEffect } from "react";

function App() {
    const [items, setitems] = useState([]);
    const [value, setValue] = useState("");
    const location = useLocation();
    const history = useHistory();

    async function Search(location) {
        const query = location.search.replace("?", "");
        const res = await axios("http://localhost:3000/search/" + query);
        const sortedResult = _.sortBy(res.data, [(o) => o.file]);
        const searchResults = sortedResult.map((i) => {
            const log = i.match.split(" ");
            const name = log[1];
            const text = log.slice(2).join(" ");

            return (
                <tr
                    onClick={() =>
                        history.push("/logs/" + i.file + "#" + i.line)
                    }
                >
                    <td>20{i.file.substring(8, 16)} </td>
                    <td>
                        <div style={{ color: "grey", display: "inline" }}>
                            {name}
                        </div>
                    </td>
                    <td style={{ width: 4000 }}>
                        <div style={{ color: "white", display: "inline" }}>
                            <Highlighter
                                highlightClassName="YourHighlightClass"
                                searchWords={[query]}
                                autoEscape={true}
                                textToHighlight={text}
                            />
                        </div>
                        <br />
                        <br />
                    </td>
                </tr>
            );
        });
        setitems(searchResults);
    }

    useEffect(() => {
        Search(location);
    }, [location]);

    async function handleKeyDown(e) {
        if (e.key === "Enter") {
            history.push("/?" + value);
        }
    }

    return (
        <div className="Center">
            <br />
            <h1 style={{ color: "white", fontSize: 22 }}>
                Haskell IRC Log Search
            </h1>
            <br />
            <input
                style={{ height: 30, fontSize: 17, color: "grey" }}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={handleKeyDown}
            />
            <br />
            <br />
            <div style={{ color: "grey" }} className="App">
                <table padding={5}>{items}</table>
            </div>
        </div>
    );
}

export default App;
