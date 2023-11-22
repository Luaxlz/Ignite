import { Play } from '@phosphor-icons/react';
import {
  CountdownContainer,
  FormContainer,
  HomeContainer,
  MinutesAmountInput,
  Separator,
  StartCountdownButton,
  TaskInput,
} from './styles';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { useEffect, useState } from 'react';
import { differenceInSeconds } from 'date-fns';

const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, 'Informe a tarefa'),
  minutesAmount: zod
    .number()
    .min(5, 'O ciclo precisa ser de no mínimo 5 minutos')
    .max(60, 'O ciclo precisa ser de no máximo 60 minutos'),
});

type newCycleFormData = zod.infer<typeof newCycleFormValidationSchema>;

interface Cycle {
  id: string;
  task: string;
  minutesAmount: number;
  startDate: Date;
}

export default function Home() {
  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null);
  const [secondsPassed, setSecondsPassed] = useState(0);

  const { register, handleSubmit, watch, reset } = useForm<newCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: '',
      minutesAmount: 0,
    },
  });

  const handleCreateNewCycle = (data: newCycleFormData) => {
    const id = String(new Date().getTime());

    const newCycle: Cycle = {
      id,
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    };

    setCycles((state) => [...state, newCycle]); //Sempre que a atualização do estado depender do estado anterior utilizar uma arrow function para fazer a nova atribuição.
    setActiveCycleId(id);
    setSecondsPassed(0);

    reset();
  };

  //finding if there is a active cycle
  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);

  //If the active cycle exists converts the cicyle total minutes to seconds
  const minutesAmountToSeconds = activeCycle
    ? activeCycle.minutesAmount * 60
    : 0;

  //If the active cycle exists get the active cycle lifespan in seconds
  const currentSeconds = activeCycle
    ? minutesAmountToSeconds - secondsPassed
    : 0;

  //Gets the cycle lifespan in minutes and remaining seconds
  const currentMinutesAmount = Math.floor(currentSeconds / 60);
  const currentSecondsAmount = currentSeconds % 60;

  //Formatting the minutes and seconds to add a 0 if the number is lower than 10
  const formattedMinutes = String(currentMinutesAmount).padStart(2, '0');
  const formattedSeconds = String(currentSecondsAmount).padStart(2, '0');

  const taskIsValid = watch('task');
  const isSubmitDisabled = !taskIsValid;

  useEffect(() => {
    if (activeCycle) {
      document.title = `${formattedMinutes}:${formattedSeconds}`;
    }
  }, [formattedMinutes, formattedSeconds, activeCycle]);

  useEffect(() => {
    let interval: number;
    if (activeCycle) {
      interval = setInterval(() => {
        setSecondsPassed(
          differenceInSeconds(new Date(), activeCycle.startDate)
        );
      }, 1000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [activeCycle]);

  return (
    <HomeContainer>
      <form action='' onSubmit={handleSubmit(handleCreateNewCycle)}>
        <FormContainer>
          <label htmlFor='task'>Vou trabalhar em</label>{' '}
          {/* é definido o texto como label para que quando o usuário clique no texto seja dado focus ao input */}
          <TaskInput
            id='task'
            list='task-suggestions'
            placeholder='Dê um nome para o seu projeto'
            {...register('task')}
          />
          <datalist id='task-suggestions'>
            <option value='Projeto 1'></option>
            <option value='Projeto 2'></option>
            <option value='Projeto 3'></option>
            <option value='Banana'></option>
          </datalist>
          <label htmlFor='minutesAmount'>durante</label>
          <MinutesAmountInput
            type='number'
            id='minutesAmount'
            placeholder='00'
            step={5}
            min={5}
            max={60}
            {...register('minutesAmount', { valueAsNumber: true })}
          />
          <span>minutos.</span>
        </FormContainer>

        <CountdownContainer>
          <span>{formattedMinutes[0]}</span>
          <span>{formattedMinutes[1]}</span>
          <Separator>:</Separator>
          <span>{formattedSeconds[0]}</span>
          <span>{formattedSeconds[1]}</span>
        </CountdownContainer>

        <StartCountdownButton type='submit' disabled={isSubmitDisabled}>
          <Play size={24} />
          Começar
        </StartCountdownButton>
      </form>
    </HomeContainer>
  );
}
