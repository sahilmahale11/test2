import { useState } from 'react';
import { Stepper } from '@mui/material';
import { Colors } from '../../utils/Theme';
import { StyledBox, StyledContainer, StyledStep, StyledStepLabel, StyledText } from './StepperScreenStyles';

interface StepperComponentProps {
    steps: string[];
    handleNextCode: (value: boolean) => void;
    stepValues: number[];
}

function StepperComponent({ steps, handleNextCode, stepValues }: StepperComponentProps) {
    const [activeStep, setActiveStep] = useState(0);
    const [values, setValues] = useState<number[]>(stepValues.length > 0 ? stepValues : []);
    // const [values, setValues] = useState<number[]>(Array(steps.length).fill(0));
    const handleCorrect = (value: boolean) => {
        if (values.length === 0) return;
        if (values[4] === 1 || values[4] === 2) return;
        const updatedValues = [...values];
        updatedValues[activeStep] = 2;
        setValues(updatedValues);

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        handleNextCode(value);
    };

    const handleWrong = (value: boolean) => {
        if (values.length === 0) return;
        if (values[4] === 1 || values[4] === 2) return;
        const updatedValues = [...values];
        updatedValues[activeStep] = 1;
        setValues(updatedValues);

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        handleNextCode(value);
    };

    return (
        <StyledContainer>
            <StyledBox
                onClick={() => {
                    handleCorrect(true);
                }}>
                <StyledText>
                    <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='32'
                        height='32'
                        viewBox='0 0 20 20'
                        fill='none'
                        style={{
                            backgroundColor: Colors.green,
                            borderRadius: '50%',
                            padding: '4px',
                        }}>
                        <path
                            d='M4.16669 10.834L7.50002 14.1673L15.8334 5.83398'
                            stroke='white'
                            strokeWidth='2'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                        />
                    </svg>
                    Match
                </StyledText>
            </StyledBox>
            <Stepper activeStep={activeStep} alternativeLabel sx={{ display: 'flex', gap: '32px' }}>
                {steps.map((label, index) => (
                    <StyledStep key={index}>
                        {(values[index] == null || values[index] === 0) && (
                            <svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32' fill='none'>
                                <circle cx='16' cy='16' r='16' fill='#CACACA' width={20} height={20} />
                                <circle cx='16' cy='16' r='10' fill='white' width={20} height={20} />
                            </svg>
                        )}
                        {values[index] === 1 && (
                            <svg
                                xmlns='http://www.w3.org/2000/svg'
                                width='32'
                                height='32'
                                viewBox='0 0 20 20'
                                fill='none'
                                style={{
                                    backgroundColor: Colors.red,
                                    borderRadius: '50%',
                                    padding: '4px',
                                }}>
                                <path
                                    d='M4.16669 4.16699L15.8334 15.8337'
                                    stroke='white'
                                    strokeWidth='2'
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    width={'20px'}
                                    height={'20px'}
                                />
                                <path
                                    d='M15.8333 4.16699L4.16666 15.8337'
                                    stroke='white'
                                    strokeWidth='2'
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                />
                            </svg>
                        )}
                        {values[index] === 2 && (
                            <svg
                                xmlns='http://www.w3.org/2000/svg'
                                width='32'
                                height='32'
                                viewBox='0 0 20 20'
                                fill='none'
                                style={{
                                    backgroundColor: Colors.green,
                                    borderRadius: '50%',
                                    padding: '4px',
                                }}>
                                <path
                                    d='M4.16669 10.834L7.50002 14.1673L15.8334 5.83398'
                                    stroke='white'
                                    strokeWidth='2'
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                />
                            </svg>
                        )}
                        <StyledStepLabel>{label}</StyledStepLabel>
                    </StyledStep>
                ))}
            </Stepper>
            <StyledBox
                onClick={() => {
                    handleWrong(false);
                }}>
                <StyledText>
                    <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='32'
                        height='32'
                        viewBox='0 0 20 20'
                        fill='none'
                        style={{
                            backgroundColor: Colors.red,
                            borderRadius: '50%',
                            padding: '4px',
                        }}>
                        <path
                            d='M4.16669 4.16699L15.8334 15.8337'
                            stroke='white'
                            strokeWidth='2'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            width={'20px'}
                            height={'20px'}
                        />
                        <path d='M15.8333 4.16699L4.16666 15.8337' stroke='white' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
                    </svg>
                    No Match
                </StyledText>
            </StyledBox>
        </StyledContainer>
    );
}

export default StepperComponent;
