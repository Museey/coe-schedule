"use client";

import React, { useMemo, useState } from 'react';
import { Course, Section } from '@/shared/interfaces';
import { CourseMock } from '@/shared/mocks';
import {
  Container,
  Stack,
  Typography,
  Box,
  Grid,
  Button,
  Chip,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableRow,
  SelectChangeEvent,
  Autocomplete,
  TextField,
  AutocompleteChangeReason,
  AutocompleteChangeDetails
} from "@mui/material";
import InfoIcon from '@mui/icons-material/Info';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const Courses: React.FC = () => {
  const [courses] = useState<Course[]>(CourseMock);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedSection, setSelectedSection] = useState<number | null>(null);
  const [courseToSelect, setCourseToSelect] = useState<Course | null>(null);

  const filteredCourses = useMemo(() =>
    courses.filter(course =>
      course.course_name_english.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.course_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.course_id.toString().includes(searchTerm)
    ),
    [courses, searchTerm]
  );

  const handleSearchChange = (_: React.SyntheticEvent, value: string) => {
    setSearchTerm(value);
  };

  const handleCourseSelect = (
    event: React.SyntheticEvent,
    value: string | Course | null,
    reason: AutocompleteChangeReason,
    details?: AutocompleteChangeDetails<Course>
  ) => {
    if (typeof value === 'object' && value !== null) {
      setSelectedCourse(value);
      setCourseToSelect(null); // Clear any previously selected course
    } else {
      setSelectedCourse(null);
    }
  };

  const handleSectionChange = (event: SelectChangeEvent<number>) => {
    setSelectedSection(Number(event.target.value));
  };

  const handleSelectCourse = (course: Course) => {
    setCourseToSelect(course);
    setSelectedSection(null);
  };

  return (
    <Container>
      <Stack sx={{ mt: 4 }}>
        <Autocomplete
          freeSolo
          options={filteredCourses}
          getOptionLabel={(option: Course | string) =>
            typeof option === 'string' ? option : `${option.course_code} - ${option.course_name_english}`
          }
          onInputChange={handleSearchChange}
          onChange={handleCourseSelect}
          renderInput={(params) => (
            <TextField
              {...params}
              label="ค้นหารหัสวิชา / ชื่อวิชา"
              variant="outlined"
              fullWidth
              sx={{ mb: 4 }}
            />
          )}
        />

        {filteredCourses.length === 0 && !selectedCourse && (
          <Typography variant="body1" color="textSecondary">
            ไม่พบวิชาที่คุณค้นหา
          </Typography>
        )}
      </Stack>

      {selectedCourse && (
        <Card variant="outlined" sx={{ mt: 4 }}>
          <CardContent>
            <Typography variant="h6">
              {selectedCourse.course_code} - {selectedCourse.course_name_english}
            </Typography>
            <Typography variant="body1">
              <strong>Credits:</strong> {selectedCourse.credits}
            </Typography>
            <Typography variant="body1">
              <strong>วันเรียน:</strong> {selectedCourse.study_days?.join(', ')}
            </Typography>

            {selectedCourse.sections && selectedCourse.sections.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <FormControl fullWidth>
                  <InputLabel>Sec</InputLabel>
                  <Select value={selectedSection || ''} onChange={handleSectionChange}>
                    {selectedCourse.sections.map((section: Section) => (
                      <MenuItem key={section.section} value={section.section}>
                        Sec {section.section}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            )}

            {selectedSection !== null && selectedCourse.sections && (
              <Table sx={{ mt: 2 }}>
                <TableBody>
                  {selectedCourse.sections.find(sec => sec.section === selectedSection)?.schedule.map((schedule, index) => (
                    <TableRow key={index}>
                      <TableCell>{schedule.instructor}</TableCell>
                      <TableCell>{schedule.day} {schedule.time}</TableCell>
                      <TableCell>{schedule.room}</TableCell>
                      <TableCell>{schedule.format}</TableCell>
                      <TableCell>{schedule.note}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}

            <Grid container justifyContent="flex-end" sx={{ mt: 2 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleSelectCourse(selectedCourse)}
                startIcon={<ExpandMoreIcon />}
              >
                เลือก
              </Button>
            </Grid>
          </CardContent>
        </Card>
      )}

      {courseToSelect && (
        <Card variant="outlined" sx={{ mt: 4 }}>
          <CardContent>
            <Typography variant="h6">
              วิชาที่เลือก: {courseToSelect.course_code} - {courseToSelect.course_name_english}
            </Typography>
            <Typography variant="body1">
              <strong>Credits:</strong> {courseToSelect.credits}
            </Typography>
            <Typography variant="body1">
              <strong>วันเรียน:</strong> {courseToSelect.study_days?.join(', ')}
            </Typography>
          </CardContent>
        </Card>
      )}
    </Container>
  );
};

export default Courses;
