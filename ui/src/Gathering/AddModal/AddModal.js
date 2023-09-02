import { t } from '@lingui/macro'
import { format, parse } from 'date-fns'
import { enAU, zhTW } from 'date-fns/locale'
import { Button, HStack, Modal, Center } from 'native-base'
import { useState, useRef } from 'react'
import { DayPicker } from 'react-day-picker'
import { useNavigate, useParams } from 'react-router-dom'

import { useApi } from './useApi'
import { getLocale } from '../../i18n'
import 'react-day-picker/dist/style.css'
import './style.css'

const DATE_FORMAT = 'yyyy-MM-dd'

export const AddModal = ({ isOpen, onClose }) => {
  const { org, slug } = useParams()
  const navigate = useNavigate()
  const { usedDateStrings, isLoading, createOccurrence } = useApi({ slug })
  const [isSaving, setSaving] = useState(false)
  const initialDate = new Date()
  const defaultMonth = initialDate
  const [selectedDay, setSelectedDay] = useState(initialDate)
  const locale = useRef(getLocale())

  const handleCreate = async () => {
    setSaving(true)
    const date = format(selectedDay, DATE_FORMAT)
    await createOccurrence({ date })
    setSaving(false)

    navigate(`/${org}/gatherings/${slug}/${date}`)
  }

  const handleClose = () => {
    if (!isSaving) {
      onClose()
    }
  }

  if (isLoading) {
    return null
  }

  const disabledDays = usedDateStrings.map((usedDateString) => parse(usedDateString, DATE_FORMAT, new Date()))

  return (
    <Modal onClose={handleClose} size="md" {...{ isOpen }}>
      <Modal.Content>
        <Modal.CloseButton />
        <Modal.Header>{t`Choose date`}</Modal.Header>
        <Modal.Body>
          <Center>
            <DayPicker
              disabled={disabledDays}
              locale={locale.current === 'zh-TW' ? zhTW : enAU}
              mode="single"
              onSelect={setSelectedDay}
              selected={selectedDay}
              {...{ defaultMonth }}
            />
          </Center>
        </Modal.Body>
        <Modal.Footer>
          <HStack space="sm">
            <Button onPress={handleClose} variant="ghost">
              {t`Cancel`}
            </Button>
            <Button isLoading={isSaving} onPress={handleCreate}>
              {t`Create`}
            </Button>
          </HStack>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  )
}
