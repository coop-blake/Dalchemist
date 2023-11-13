import styled from 'styled-components';


import React, { ReactNode } from 'react';


const Container = styled.div`
    display: flex;
    `

const Pane = styled.div<PaneProps>`
flex: ${props => props.weight ?? 1};
`;

interface PaneProps {
    weight: number;
  }
interface SplitScreenProps {
    children: [ReactNode,ReactNode];
    leftWeight?: number;
    rightWeight?: number;
}

export const SplitScreen:React.FC<SplitScreenProps> = ({
    children,
    leftWeight = 1,
    rightWeight = 1,
}) =>{
    const [right,left] = children
    return (
        <Container>
            <Pane weight={leftWeight}>
                {left}
            </Pane>
            <Pane weight={rightWeight}>
                {right}
            </Pane>
        </Container>
    )
}