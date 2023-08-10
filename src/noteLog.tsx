import styled from "styled-components";
import { useRef, useEffect } from "react";

const NoteLogContainer = styled.div`
  width: 300px;
  height: 300px;
  overflow: scroll;
`;

const NoteRowContainer = styled.div`
  display: flex;
`;

const Notes = styled.div`
  display: flex;
  margin-left: 5px;
`;

export type NoteLogCollection = {
  entries: Array<NoteLogEntry>;
};

export type NoteLogEntry = {
  notes: Array<string>;
  eventName: string;
};

type NoteLogProps = {
  noteLog: NoteLogCollection;
};

const NoteRow = (props: { noteLogEntry: NoteLogEntry }) => {
  return (
    <>
      <NoteRowContainer>
        {props.noteLogEntry.notes.map((note) => {
          return <Notes>{note}</Notes>;
        })}
        {"  -->  "}
        {props.noteLogEntry.eventName}
      </NoteRowContainer>
    </>
  );
};

export const NoteLog = (noteLogProps: NoteLogProps) => {
  const { noteLog } = noteLogProps;
  const noteLogEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    noteLogEndRef.current!.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [noteLogProps]);

  return (
    <NoteLogContainer>
      {noteLog.entries.map((notes) => {
        return <NoteRow noteLogEntry={notes} />;
      })}
      <div ref={noteLogEndRef} />
    </NoteLogContainer>
  );
};
