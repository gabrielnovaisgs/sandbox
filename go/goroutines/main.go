package main

import (
	"fmt"
	"time"
)

func Routine() {
	fmt.Printf("Print from routine")
}

func main() {
	go Routine()
	time.Sleep(1 * time.Second)
	fmt.Println("Hello World")
}
