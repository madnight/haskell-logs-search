import "./App.css";
import axios from "axios";
import _ from "lodash";
import { useLocation } from "react-router-dom";
import { useHistory } from "react-router-dom";
import Highlighter from "react-highlight-words";
import React, { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";

function App() {
    const [items, setitems] = useState([]);
    const [value, setValue] = useState("");
    const [hits, setHits] = useState("");
    const location = useLocation();
    const history = useHistory();

    async function Search(location) {
        const query = location.search.replace("?", "");
        const res = await axios("http://localhost:3000/search/" + query);
        const sortedResult = _.sortBy(res.data.results, [(o) => o.file]);
        setHits(res.data.hits);
        const searchResults = sortedResult.map((i) => {
            if (!i) return;
            const log = i.match.split(" ");
            const name = log[1].slice(0, 20);
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
                                searchWords={[query.replace(/&page=\d+/, "")]}
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

    const Pagination = () => {
        if (hits / 100 < 1) {
            return null;
        }
        return (
            <div style={{ color: "white", width: "30%", margin: "0 auto" }}>
                <ReactPaginate
                    previousLabel={"<--"}
                    nextLabel={"-->"}
                    breakLabel={"..."}
                    breakClassName={"break-me"}
                    pageCount={hits / 100}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={3}
                    onPageChange={(i) => {
                        history.push(
                            location.search.replace(/&page=\d+/, "") +
                                "&page=" +
                                ++i.selected
                        );
                    }}
                    containerClassName={"pagination"}
                    activeClassName={"active"}
                />
            </div>
        );
    };

    return (
        <div className="Center">
            <br />
            <br />
            <h1 style={{ color: "white", fontSize: 22 }}>
                Haskell IRC Log Search
            </h1>
            <h2 style={{ color: "white", fontSize: 17 }}>2002 - 2020</h2>
            <br />
            <input
                style={{ height: 30, width: 500, fontSize: 17, color: "grey" }}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={handleKeyDown}
            />
            <br />
            <br />
            <div style={{ color: "grey" }}>
                Found matches in {hits} files (days)
            </div>
            <br />
            <div className="SearchResults">
                <div style={{ color: "grey" }} className="App">
                    <table padding={5}>{items}</table>
                </div>
                <br />¬{Pagination()}
            </div>
        </div>
    );
}

export default App;
