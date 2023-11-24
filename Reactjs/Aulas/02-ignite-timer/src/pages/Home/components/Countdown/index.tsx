import { useContext, useEffect } from 'react';
import { CountdownContainer, Separator } from './styles';
import { differenceInSeconds } from 'date-fns';
import { CyclesContext } from '../../../../contexts/CyclesContext';

export function Countdown() {
  const {
    activeCycle,
    markCurrentCycleAsFinished,
    secondsPassed,
    setSecondsPassedProxy,
  } = useContext(CyclesContext);

  //If the active cycle exists converts the cycle total minutes to seconds
  const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0;

  //If the active cycle exists get the active cycle lifespan in seconds
  const currentSeconds = activeCycle ? totalSeconds - secondsPassed : 0;

  //Gets the cycle lifespan in minutes and remaining seconds
  const currentMinutesAmount = Math.floor(currentSeconds / 60);
  const currentSecondsAmount = currentSeconds % 60;

  //Formatting the minutes and seconds to add a 0 if the number is lower than 10
  const formattedMinutes = String(currentMinutesAmount).padStart(2, '0');
  const formattedSeconds = String(currentSecondsAmount).padStart(2, '0');

  useEffect(() => {
    let interval: number;
    if (activeCycle) {
      interval = setInterval(() => {
        const secondsDifference = differenceInSeconds(
          new Date(),
          activeCycle.startDate
        );

        // tests if the time in seconds that has passed is greater/equal than the total seconds of the cycle lifespan, if yes than map() the cycle array and set the finishedDate property with the current date.

        //Another important thing to remember is that, whenever we update a state AND that said state depends on its previous state, we must use a arrow function to update that said state with de use of the (state) => state.map(cycle) in this case.
        if (secondsDifference >= totalSeconds) {
          markCurrentCycleAsFinished();
          setSecondsPassedProxy(totalSeconds);
          clearInterval(interval);
        } else {
          //Important to only set the secondsPassed variable ONLY if the cycle is not completed.
          setSecondsPassedProxy(secondsDifference);
        }
      }, 1000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [
    activeCycle,
    totalSeconds,
    markCurrentCycleAsFinished,
    setSecondsPassedProxy,
  ]);

  useEffect(() => {
    if (activeCycle) {
      document.title = `${formattedMinutes}:${formattedSeconds}`;
    }
  }, [formattedMinutes, formattedSeconds, activeCycle]);
  return (
    <CountdownContainer>
      <span>{formattedMinutes[0]}</span>
      <span>{formattedMinutes[1]}</span>
      <Separator>:</Separator>
      <span>{formattedSeconds[0]}</span>
      <span>{formattedSeconds[1]}</span>
    </CountdownContainer>
  );
}
