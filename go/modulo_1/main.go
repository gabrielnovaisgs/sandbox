package main

import (
	"bufio"
	"fmt"
	"io"
	"log"
	"os"
	"regexp"
	"time"
)

type ErrorLog struct {
	Level     string
	Timestamp time.Time
	Message   string
}

type LogCount struct {
	Error int
	Warn  int
}

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

	timeLayout := "2006-01-02 15:04:05"
	r := regexp.MustCompile(`(\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2})\s(WARN|ERROR)\s(.*)`)
	FindAndParse(file, r, timeLayout, &logSummary)
	OutputLogSummaryTerminal(&logSummary)

}

func FindAndParse(reader io.Reader, r *regexp.Regexp, timeLayout string, LogCount *LogCount) {
	scanner := bufio.NewScanner(reader)

	for scanner.Scan() {
		found := r.FindStringSubmatch(scanner.Text())
		if len(found) < 1 {
			continue
		}
		timeConverted, timeErr := time.Parse(timeLayout, found[1])
		if timeErr != nil {
			fmt.Println("Error found", timeErr.Error())
			continue
		}

		log := ErrorLog{
			Timestamp: timeConverted,
			Level:     found[2],
			Message:   found[3],
		}

		if log.Level == "ERROR" {
			LogCount.Error++
		}

		if log.Level == "WARN" {
			LogCount.Warn++
		}

		OutputLogterminal(&log, timeLayout)
	}

	if err := scanner.Err(); err != nil {
		fmt.Println("Error during scan:", err)
	}

}

func OutputLogterminal(log *ErrorLog, timeLayout string) {
	fmt.Printf("Time: %s - Message: %s\n", log.Timestamp.Format(timeLayout), log.Message)
}

func OutputLogSummaryTerminal(LogCount *LogCount) {
	fmt.Printf("Total errors: %d\nTotal warns: %d\n", LogCount.Error, LogCount.Warn)
}
