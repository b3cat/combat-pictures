import { Container, Typography } from '@mui/material'
import React from 'react'
import CombatPictureGenerator from './components/combat-picture-generator'

export const App = () =>  <Container>
  <Typography variant='h2' gutterBottom={true}>
    Combat Pictures
  </Typography>
  <CombatPictureGenerator/>
</Container>