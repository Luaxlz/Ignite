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
import { useState } from 'react';

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
}

export default function Home() {
  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null);

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
    };

    setCycles((state) => [...state, newCycle]); //Sempre que a atualização do estado depender do estado anterior utilizar uma arrow function para fazer a nova atribuição.
    setActiveCycleId(id);

    reset();
  };

  const findActiveCycle = cycles.find((cycle) => cycle.id === activeCycleId);

  const taskIsValid = watch('task');
  const isSubmitDisabled = !taskIsValid;
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
          <span>0</span>
          <span>0</span>
          <Separator>:</Separator>
          <span>0</span>
          <span>0</span>
        </CountdownContainer>

        <StartCountdownButton type='submit' disabled={isSubmitDisabled}>
          <Play size={24} />
          Começar
        </StartCountdownButton>
      </form>
    </HomeContainer>
  );
}
