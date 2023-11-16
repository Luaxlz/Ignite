import styled from 'styled-components';

export const LayoutContainer = styled.div`
  max-width: 74rem; //1.184px
  height: calc(
    100vh - 10rem
  ); // Calc para utilizar 100% da tela verticalmente porém menos o espaçamento da margem
  margin: 5rem auto; // Margem de 5rem verticalmente e automático para as laterais.
  padding: 2.5rem; // Conteúdo da pagina ficar um pouco mais distanciado das bordas.

  background: ${(props) =>
    props.theme['gray-800']}; // Adicionando cor de fundo para a box do conteúdo
  border-radius: 8px; // Poucas vezes será necessário medida em rem, sempre utilizar medidas absolutas.

  display: flex;
  flex-direction: column; //Alinhamento dos elementos na direção de coluna
`;
