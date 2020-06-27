import React from 'react';
import {
	Card,
	CardContent,
	Container,
	Button,
	Box,
	Stepper,
	Step,
	Grid,
	StepLabel,
	CircularProgress,
} from '@material-ui/core';
import { Field, Form, Formik, FormikConfig, FormikValues } from 'formik';
import './App.css';
import { CheckboxWithLabel, TextField } from 'formik-material-ui';
import { object, mixed, number } from 'yup';

interface FormikStepProps
	extends Pick<FormikConfig<FormikValues>, 'children' | 'validationSchema'> {
	label: string;
}

const sleep = (time: any) => new Promise((acc) => setTimeout(acc, time));

function App() {
	return (
		<Container maxWidth='sm'>
			<Card>
				<CardContent>
					<FormikStepper
						initialValues={{
							firstName: '',
							lastName: '',
							millionaire: false,
							money: 0,
							description: '',
						}}
						onSubmit={async (values) => {
							await sleep(3000);
							console.log('values', values);
						}}
					>
						<FormikStep label='Personal Data'>
							<Box paddingBottom={2}>
								<Field
									fullWidth
									name='firstName'
									component={TextField}
									label='First Name'
								/>
							</Box>
							<Box paddingBottom={2}>
								<Field
									fullWidth
									name='lastName'
									component={TextField}
									label='Last Name'
								/>
							</Box>
							<Box paddingBottom={2}>
								<Field
									name='millionaire'
									type='checkbox'
									component={CheckboxWithLabel}
									Label={{ label: 'I am a millionaire' }}
								/>
							</Box>
						</FormikStep>
						<FormikStep
							label='Bank Accounts'
							validationSchema={object({
								money: mixed().when('millionaire', {
									is: true,
									then: number()
										.required()
										.min(
											1_000_000,
											'Because you said you are a millionaire you need to have 1 million'
										),
									otherwise: number().required(),
								}),
							})}
						>
							<Box paddingBottom={2}>
								<Field
									fullWidth
									name='money'
									type='number'
									component={TextField}
									label='Money'
								/>
							</Box>
						</FormikStep>
						<FormikStep label='More Info'>
							<Box paddingBottom={2}>
								<Field
									fullWidth
									name='description'
									component={TextField}
									label='Description'
								/>
							</Box>
						</FormikStep>
					</FormikStepper>
				</CardContent>
			</Card>
		</Container>
	);
}
export default App;

export const FormikStep = ({ children, validationSchema }: FormikStepProps) => {
	return <>{children}</>;
};

export const FormikStepper = ({
	children,
	...props
}: FormikConfig<FormikValues>) => {
	const childrenArray = React.Children.toArray(children) as React.ReactElement<
		FormikStepProps
	>[];
	const [step, setStep] = React.useState(0);
	const [completed, setCompleted] = React.useState(false);
	const currentChild = childrenArray[step];

	const isLastStep = () => {
		return step === childrenArray.length - 1;
	};

	return (
		<Formik
			{...props}
			validationSchema={currentChild.props.validationSchema}
			onSubmit={async (values, helpers) => {
				if (isLastStep()) {
					await props.onSubmit(values, helpers);
					setCompleted(true);
				} else {
					setStep((s) => s + 1);
				}
			}}
		>
			{({ isSubmitting }) => (
				<Form autoComplete='off'>
					<Stepper alternativeLabel activeStep={step}>
						{childrenArray.map((child, index) => (
							<Step
								key={child.props.label}
								completed={step > index || completed}
							>
								<StepLabel>{child.props.label}</StepLabel>
							</Step>
						))}
					</Stepper>

					{currentChild}
					<Grid container spacing={2}>
						<Grid item>
							{step > 0 ? (
								<Button
									disabled={isSubmitting}
									variant='contained'
									color='primary'
									onClick={() => setStep((s) => s - 1)}
								>
									Back
								</Button>
							) : null}
						</Grid>

						<Grid item>
							<Button
								disabled={isSubmitting}
								variant='contained'
								color='primary'
								type='submit'
								startIcon={
									isSubmitting ? <CircularProgress size='1rem' /> : null
								}
							>
								{isLastStep() ? 'Submit' : 'Next'}
							</Button>
						</Grid>
					</Grid>
				</Form>
			)}
		</Formik>
	);
};
