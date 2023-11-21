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
import { useState } from 'react';
import { useForm } from 'react-hook-form';

export default function Home() {
  const { register, handleSubmit } = useForm();

  const [task, setTask] = useState('');
  return (
    <HomeContainer>
      <form action=''>
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
            {...register('minutesAmount')}
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

        <StartCountdownButton type='submit' disabled={!task}>
          <Play size={24} />
          Começar
        </StartCountdownButton>
      </form>
    </HomeContainer>
  );
}
