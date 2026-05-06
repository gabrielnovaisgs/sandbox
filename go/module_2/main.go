package main

import (
	"encoding/json"
	"io"
	"log"
	"os"
	"path/filepath"
	"time"
)

type Metadata struct {
	Name    string    `json:"filename"`
	Size    int64     `json:"size"`
	LastMod time.Time `json:"last_modification"`
}

func main() {

	sourcePath, destDirPath := validateArgs(os.Args[1:])
	src := NewSourceLocal(sourcePath)
	dest := NewDestionationLocal(destDirPath)

	Sync(dest, src)

	sourceStats, err := os.Stat(sourcePath)
	if err != nil {
		log.Fatal(err.Error())
	}

	destStats, err := os.Stat(destDirPath)
	if err != nil {
		log.Fatal(err.Error())
	}

	if !destStats.IsDir() {
		log.Fatal("No destiny folder selected")
	}

	sourceFile, err := os.Open(sourcePath)
	if err != nil {
		log.Fatal(err)
	}
	defer sourceFile.Close()

	fileDestPath := filepath.Join(destDirPath, sourceStats.Name())

	destFile, err := os.Create(fileDestPath)
	if err != nil {
		log.Fatal(err)
	}
	defer destFile.Close()

	io.Copy(destFile, sourceFile)

	metadataPath := filepath.Join(destDirPath, "metadata.json")
	metadataFile, err := os.Create(metadataPath)
	if err != nil {
		log.Fatal(err)
	}
	defer metadataFile.Close()

	meta := &Metadata{
		Name:    sourceStats.Name(),
		Size:    sourceStats.Size(),
		LastMod: sourceStats.ModTime(),
	}
	encoder := json.NewEncoder(metadataFile)
	encoder.SetIndent("", "  ")
	encoder.Encode(meta)

}
func validateArgs(args []string) (srcPath string, destPath string) {

	if len(args) < 1 {
		log.Fatal("No source path")
	}

	if len(args) < 2 {
		log.Fatal("No destiny path")
	}
	return args[0], args[1]
}

type Source interface {
	SrcFile() io.Reader
	GetMetadata() (Metadata, error)
}

type SourceLocal struct {
	sourcePath string
	metadata   Metadata
}

func NewSourceLocal(srcPath string) *SourceLocal {
	return &SourceLocal{
		sourcePath: srcPath,
	}
}
func (sl *SourceLocal) SrcFile() io.Reader {
	sourceStats, err := os.Stat(sl.sourcePath)
	if err != nil {
		log.Fatal(err.Error())
	}

	sl.metadata = Metadata{
		Name:    sourceStats.Name(),
		Size:    sourceStats.Size(),
		LastMod: sourceStats.ModTime(),
	}

	sourceFile, err := os.Open(sl.sourcePath)
	if err != nil {
		log.Fatal(err)
	}
	defer sourceFile.Close()
}

func (sl *SourceLocal) GetMetadata() (Metadata, error) {

}

type Destination interface {
	SaveMetada(meta Metadata) error
	DestFile() io.Writer
}

type DestinationLocal struct {
	destDirPath string
}

func (d *DestinationLocal) SaveMetada(meta Metadata) error {}
func (d *DestinationLocal) DestFile() io.Writer {
	destStats, err := os.Stat(d.destDirPath)
	if err != nil {
		log.Fatal(err.Error())
	}

	if !destStats.IsDir() {
		log.Fatal("No destiny folder selected")
	}
}

func NewDestionationLocal(destPath string) *DestinationLocal {
	return &DestinationLocal{
		destDirPath: destPath,
	}
}

func Sync(dest Destination, src Source) {
	destFile := dest.DestFile()
	srcFile := src.SrcFile()
	io.Copy(destFile, srcFile)
	dest.SaveMetada()

}
