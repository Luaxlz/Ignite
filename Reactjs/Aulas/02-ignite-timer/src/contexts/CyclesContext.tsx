import {
  ReactNode,
  createContext,
  useEffect,
  useReducer,
  useState,
} from 'react';
import { Cycle, cyclesReducer } from '../reducers/cycles/reducer';
import {
  addNewCycleAction,
  interruptCurrentCycleAction,
  markCurrentCycleAsFinishedAction,
} from '../reducers/cycles/actions';
import { differenceInSeconds } from 'date-fns';

interface CyclesContextType {
  cycles: Cycle[];
  activeCycle: Cycle | undefined;
  activeCycleId: string | null;
  secondsPassed: number;
  markCurrentCycleAsFinished: () => void;
  setSecondsPassedProxy: (second: number) => void;
  createNewCycle: (data: CreateCycleData) => void;
  interruptCurrentCycle: () => void;
}

interface CreateCycleData {
  task: string;
  minutesAmount: number;
}

interface CyclesContextProviderProps {
  children: ReactNode;
}

export const CyclesContext = createContext({} as CyclesContextType);

export function CyclesContextProvider({
  children,
}: CyclesContextProviderProps) {
  //Reducers are a great tool for dealing with more complex state changes in our application, a reducer receives the current state, performs some action and returns the updated state.
  const [cyclesState, dispatch] = useReducer(
    cyclesReducer,
    {
      cycles: [],
      activeCycleId: null,
    },
    (initialState) => {
      const storedStateAsJSON = localStorage.getItem(
        '@ignite-timer-1.0.0:cycles-state'
      );

      if (storedStateAsJSON) {
        return JSON.parse(storedStateAsJSON);
      }

      return initialState;
    }
  );
  const { cycles, activeCycleId } = cyclesState;

  //finding if there is a active cycle
  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);

  const [secondsPassed, setSecondsPassed] = useState(() => {
    //IF there is a active cycle, calculate seconds passed and initialize the secondsPassed state with the remaining seconds.
    if (activeCycle) {
      return differenceInSeconds(new Date(), new Date(activeCycle?.startDate));
    }

    return 0;
  });

  const setSecondsPassedProxy = (seconds: number) => {
    setSecondsPassed(seconds);
  };

  const createNewCycle = (data: CreateCycleData) => {
    const id = String(new Date().getTime());

    const newCycle: Cycle = {
      id,
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    };

    dispatch(addNewCycleAction(newCycle));
    setSecondsPassed(0);
  };

  const markCurrentCycleAsFinished = () => {
    dispatch(markCurrentCycleAsFinishedAction());
  };

  const interruptCurrentCycle = () => {
    dispatch(interruptCurrentCycleAction());
  };

  useEffect(() => {
    //The goal here is to save the cycles info in browser local storage, to do this whe need to convert the data to json format
    const stateJSON = JSON.stringify(cyclesState);
    localStorage.setItem('@ignite-timer-1.0.0:cycles-state', stateJSON);
  }, [cyclesState]);

  return (
    <CyclesContext.Provider
      value={{
        cycles,
        activeCycle,
        activeCycleId,
        secondsPassed,
        markCurrentCycleAsFinished,
        setSecondsPassedProxy,
        createNewCycle,
        interruptCurrentCycle,
      }}>
      {children}
    </CyclesContext.Provider>
  );
}
