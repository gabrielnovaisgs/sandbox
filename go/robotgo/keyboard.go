package main

import (
	"fmt"

	"github.com/go-vgo/robotgo"
)

func keyboard() {
	robotgo.MouseSleep = 300

	robotgo.Move(100, 100)
	fmt.Println(robotgo.Location())
	robotgo.Type("Hi, Seattle space needle, Golden gate bridge, One world trade center.")
}
