package stores

import (
	"fmt"
	"math"
	"net/http"
	"slices"
)

const MaxFileSize = 2098

func VerifyLogo(logo []byte) error {
	fileSize := math.Round(float64(len(logo) / 1024))
	if fileSize > MaxFileSize {
		return fmt.Errorf("image too large")
	}
	mimeType := http.DetectContentType(logo)
	acceptedMimeTypes := []string{"image/png", "image/gif", "image/jpeg"}

	if !slices.Contains(acceptedMimeTypes, mimeType) {
		return fmt.Errorf("unknown file type in logo upload")
	}
	return nil
}
