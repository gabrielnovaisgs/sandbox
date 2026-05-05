package main

import (
	"bufio"
	"errors"
	"fmt"
	"io"
	"log"
	"os"
	"strings"
)

type ErrorLog struct {
	Level     string
	Timestamp string
	Message   string
}

type LogCount struct {
	Error int
	Warn  int
}

const logTimeFormatSize = len("2024-05-04 10:05:00")

func main() {
	args := os.Args[1:]

	if len(args) < 1 {
		log.Fatal("No folder selected")

	}

	file, err := os.Open(args[0])
	if err != nil {
		log.Fatal(err.Error())
	}
	defer file.Close()

	logSummary := LogCount{
		Error: 0,
		Warn:  0,
	}

	findAndParse(file, &logSummary, OutputLogterminal)
	OutputLogSummaryTerminal(&logSummary)

}

func findAndParse(reader io.Reader, logSummary *LogCount, onFound func(*ErrorLog)) {
	scanner := bufio.NewScanner(reader)
	lineNumber := 0
	for scanner.Scan() {
		lineNumber++
		errorLog, err := splitLog(scanner.Text())

		if err != nil {
			errorLog = nil

			fmt.Fprintf(os.Stderr, "Error in line %d: %s\n", lineNumber, err.Error())
			continue
		}
		if errorLog.Level == "ERROR" {
			logSummary.Error++
		}

		if errorLog.Level == "WARN" {
			logSummary.Warn++
		}

		onFound(errorLog)
	}

	if err := scanner.Err(); err != nil {
		fmt.Println("Error during scan:", err)
	}

}

func splitLog(lineLog string) (*ErrorLog, error) {
	datePart := lineLog[:logTimeFormatSize]
	levelPart := strings.Split(lineLog[(logTimeFormatSize+1):], " ")[0]
	if levelPart != "ERROR" && levelPart != "WARN" {
		return &ErrorLog{}, errors.New("Invalid log")
	}
	messagePart := lineLog[logTimeFormatSize+len(levelPart)+2:]
	return &ErrorLog{
		Timestamp: datePart,
		Level:     levelPart,
		Message:   messagePart,
	}, nil

}

func OutputLogterminal(log *ErrorLog) {
	fmt.Printf("Time: %s - Message: %s\n", log.Timestamp, log.Message)
}

func OutputLogSummaryTerminal(LogCount *LogCount) {
	fmt.Printf("Total errors: %d\nTotal warns: %d\n", LogCount.Error, LogCount.Warn)
}
