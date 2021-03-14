import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { Button, Media, Modal } from "react-bootstrap";
import { firestore } from "../firebase";

const _deleteComment = (docid, id) => {
  firestore
    .collection("News")
    .doc(docid)
    .collection("Comments")
    .doc(id)
    .delete();
};

export default function Comments(props) {
  const [boards, setBoards] = useState([]);

  useEffect(() => {
      if (props.id !== null) {
        firestore
        .collection("News")
        .doc(props.id)
        .collection("Comments")
        .onSnapshot((querySnapshot) => {
          const boards = [];
          querySnapshot.forEach((docs) => {
            boards.push({
              Comment: docs.data().Comment,
              userName: docs.data().userName,
              key: docs.id,
            });
          });
          setBoards(boards);
        })
      }
    
  }, [props.id,props.show]);

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">Comments</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {boards.map((chat) => (
          <div>
          <Media>
            <img
              className="align-self-start mr-3"
              alt="Comment-img"
              width={64}
              height={64}
              src="/comment-logo.png"
            />
            <Media.Body>
              <h5>{chat.userName}</h5>
              <p>{chat.Comment}</p>
            </Media.Body>
            {props.super ? (
              <Button
                style={{
                  borderRadius: "50%",
                  padding: "10px 0",
                  width: "50px",
                  marginRight: "2em",
                }}
                onClick={() => _deleteComment(props.id, chat.key)}
                variant="danger"
              >
                <FontAwesomeIcon icon={faTrash} />
              </Button>
            ) : (
              ""
            )}
          </Media>
          <hr/>
          </div>
        ))}
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}
