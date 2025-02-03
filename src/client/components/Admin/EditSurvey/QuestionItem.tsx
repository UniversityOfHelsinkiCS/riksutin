import React from 'react'
import { enqueueSnackbar } from 'notistack'
import { useTranslation } from 'react-i18next'
import {
  Badge,
  Box,
  Chip,
  IconButton,
  InputLabel,
  Tooltip,
} from '@mui/material'

import FingerprintIcon from '@mui/icons-material/Fingerprint'
import LowPriorityIcon from '@mui/icons-material/LowPriority'
import ChildCareIcon from '@mui/icons-material/ChildCare'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'

import type { Locales, Question } from '@types'

import { useEditQuestionPriorityMutation } from '../../../hooks/useQuestionMutation'

import QuestionItemMenu from './QuestionItemMenu'

import { UpdatedQuestionLocation } from '../../../../validators/questions'

interface PositionHandleProps {
  question: Question
  questions: Question[]
}

interface QuestionsProps {
  question: Question
  questions: Question[]
  language: keyof Locales
}

const QuestionItemPositionHandles = ({
  question,
  questions,
}: PositionHandleProps) => {
  const { t } = useTranslation()
  const mutation = useEditQuestionPriorityMutation(question.id)

  const parentChildQuestions = questions.filter(
    (q) => q.parentId === question.parentId
  )

  const handleChangePosition = async (
    destinationData: UpdatedQuestionLocation
  ) => {
    try {
      await mutation.mutateAsync(destinationData)

      enqueueSnackbar(t('admin:rePrioritizeSuccess'), { variant: 'success' })
    } catch (error: any) {
      enqueueSnackbar(error.message, { variant: 'error' })
    }
  }

  const onMoveUp = () => {
    const destination = {
      parentId: question.parentId,
      priority: question.priority - 1,
    }

    handleChangePosition(destination)
  }

  const onMoveDown = () => {
    const destination = {
      parentId: question.parentId,
      priority: question.priority + 1,
    }

    handleChangePosition(destination)
  }

  const onMoveLeft = () => {
    const parentQuestion = questions.find((q) => q.id === question.parentId)

    if (!parentQuestion) return

    const destination = {
      parentId: parentQuestion.parentId,
      priority: parentQuestion.priority + 1,
    }

    handleChangePosition(destination)
  }

  const onMoveRight = () => {
    const precedingQuestion = parentChildQuestions.find(
      (q) => q.priority === question.priority - 1
    )

    if (!precedingQuestion) return

    const precedingChilds = questions.filter(
      (q) => q.parentId === precedingQuestion.id
    )

    const priority = precedingChilds.length >= 1 ? precedingChilds.length : 0

    const destination = {
      parentId: precedingQuestion.id,
      priority,
    }

    handleChangePosition(destination)
  }

  return (
    <Box sx={{ mr: 2 }}>
      {question.priority !== 0 && (
        <IconButton size="small" onClick={onMoveUp}>
          <KeyboardArrowUpIcon />
        </IconButton>
      )}

      {question.priority < parentChildQuestions.length - 1 && (
        <IconButton size="small" onClick={onMoveDown}>
          <KeyboardArrowDownIcon />
        </IconButton>
      )}

      {(question.parentId || parentChildQuestions.length <= 1) && (
        <IconButton size="small" onClick={onMoveLeft}>
          <KeyboardArrowLeftIcon />
        </IconButton>
      )}

      {question.priority > 0 && (
        <IconButton size="small" onClick={onMoveRight}>
          <KeyboardArrowRightIcon />
        </IconButton>
      )}
    </Box>
  )
}

const QuestionItem = ({ question, questions, language }: QuestionsProps) => (
  <Box
    key={question.id}
    sx={{
      p: 2,
      my: 4,
      border: 1,
      position: 'relative',
      '&:hover': {
        border: 1,
        borderColor: '#0288d1',
      },
    }}
  >
    <InputLabel
      sx={{
        mt: '-1.75em',
        px: '0.5em',
        zIndex: 2,
        width: 'full',
        backgroundColor: 'white',
        position: 'absolute',
      }}
    >
      {question.title[language]}
    </InputLabel>
    <Box sx={{ mt: 1, display: 'flex' }}>
      <QuestionItemPositionHandles question={question} questions={questions} />

      <QuestionItemMenu question={question} />

      <Tooltip title="The number represents the unique ID of the question">
        <Badge sx={{ mr: 1 }} badgeContent={question.id} color="primary">
          <FingerprintIcon />
        </Badge>
      </Tooltip>

      {question.parentId && (
        <Tooltip title="This badge represents that the question is a child question. The number represents the ID number of the parent question">
          <Badge
            sx={{ mr: 1 }}
            badgeContent={question.parentId}
            color="primary"
          >
            <ChildCareIcon />
          </Badge>
        </Tooltip>
      )}

      <Tooltip title="Priority determines the order in which the questions appear on the survey. 0 being the first question. Child question priorities starts from 0 but their priorities are only valid inside the child tree">
        <Chip
          sx={{
            mx: 2,
            px: '0.3rem',
            fontWeight: 'normal',
            borderRadius: '1rem',
          }}
          label={`Priority: ${question.priority}`}
          color="primary"
          variant="outlined"
          size="small"
          icon={<LowPriorityIcon />}
        />
      </Tooltip>
    </Box>
  </Box>
)

export default QuestionItem
