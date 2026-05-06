package main

import (
	"bufio"
	"bytes"
	"fmt"
	"io"
	"os"
	"strings"
)

func main() {

}

func basicBuffers() {
	var buf bytes.Buffer //Buffer is a []bytes with some functions
	var buf2 bytes.Buffer
	fmt.Fprint(&buf, "First text") // Writing to buffer 1

	io.Copy(&buf2, &buf) // Copy from one buffer to another

	buf.WriteString("Second text") // Writing string to buffer 1
	fmt.Println(buf2.String())     // Print buffer 2
	fmt.Fprintln(os.Stdout, &buf)  // Writing from buffer 1 to Stdout
}

func mergeMultipleReaders() {
	r1 := strings.NewReader("Hello ")
	r2 := strings.NewReader("World\n")

	newReader := io.MultiReader(r1, r2)

	io.Copy(os.Stdout, newReader)
}

func multiWriter() {
	var (
		buf1 bytes.Buffer
		buf2 bytes.Buffer
	)

	mw := io.MultiWriter(&buf1, &buf2)
	r := strings.NewReader("My text")
	io.Copy(mw, r)

	fmt.Println("Buffer 1: ", buf1.String())
	fmt.Println("Buffer 2: ", buf2.String())

}

func teeReader() {
	log := new(bytes.Buffer)
	data := strings.NewReader("Hello world!\n")
	fmt.Println("Content from log: ", log.String())
	teeReader := io.TeeReader(data, log) // it writes in log what i receive in data

	io.Copy(os.Stdout, teeReader)
	fmt.Println("Content from log: ", log.String())

}

func pipeGo() {
	// Pipe Writer awaits until someone (pipeReader) consume the value
	// so we need to run it in a go rotine
	pipeReader, pipeWriter := io.Pipe()
	go func() {
		defer pipeWriter.Close()
		fmt.Fprint(pipeWriter, "Hello World")
	}()

	io.Copy(os.Stdout, pipeReader)
}

type Writer int

// Writer implements io.Writer interface
func (w *Writer) Write(p []byte) (n int, err error) {
	fmt.Printf("Writing: %s\n", p)
	return len(p), nil
}

func bufferWriter() {
	bw := bufio.NewWriterSize(new(Writer), 4)

	bw.Write([]byte{'a'}) // buffer has space
	bw.Write([]byte{'b'}) // buffer has space
	bw.Write([]byte{'c'}) // buffer has space
	bw.Write([]byte{'d'}) // buffer has space

	bw.Write([]byte{'e'}) // buffer is full. flush `abcd` and add `e` to the buffer

	bw.Flush() // flush `e` to underlying Writer

	bw.Write([]byte("abcdefghij")) // `abcdefghij` is bigger than 4 so we flush all to underlying Writer

	text := "abcd"

	bw.Write([]byte(text))
	bw.Write([]byte{'e'})
}
