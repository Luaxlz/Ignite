import { createContext, useContext, useState } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CyclesContext = createContext({} as any);

function Countdown() {
  const { activeCycle } = useContext(CyclesContext);
  return <h1>Countdown: {activeCycle}</h1>;
}

function NewCycleForm() {
  const { activeCycle, setActiveCycle } = useContext(CyclesContext);
  return <h1>NewCycleForm</h1>;
}

export default function HomeTemp() {
  const [activeCycle, setActiveCycle] = useState(0);
  return (
    <CyclesContext.Provider value={(activeCycle, setActiveCycle)}>
      <div>
        <NewCycleForm />
        <Countdown />
      </div>
    </CyclesContext.Provider>
  );
}
