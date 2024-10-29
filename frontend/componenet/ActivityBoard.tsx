import React from "react";
import { Button, Modal } from "react-bootstrap";
import ActivityTable from "./ActivityTable";

export default function ActivityBoard({ className, isLoading, activities }) {
    return (
        <div>
            <div className={className} style={{
                    borderTopLeftRadius: "10px",
                    borderTopRightRadius: "10px",
                    width: "100%", height: "50px",
                    marginTop: "10px",
                    textAlign: "center",
                    alignContent: "center",
                    fontSize: "large",
                }}>
                    活動清單列表
            </div>
			{isLoading ? (<div className="bg-light text-dark" style={{
                    // backgroundColor: "#1858a6",
                    borderBottomLeftRadius: "5px",
                    borderBottomRightRadius: "5px",
                    width: "100%", height: "100px",
                    // marginTop: "5px",
                    textAlign: "center",
                    alignContent: "center",
                    fontSize: "large",
                    // color: "white"
                    }}>
                        無
                </div>) : (
                    <ActivityTable activities={activities} />
			)}

	  </div>
    )
}