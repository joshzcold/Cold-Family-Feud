package api

import (
	"encoding/base64"
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

func LogoUpload(client *Client, event *Event) error {
	s := store
	base64DecodedLogoData, err := base64.StdEncoding.DecodeString(event.LogoData)
	if err != nil {
		return fmt.Errorf(" %w", err)
	}
	err = s.saveLogo(event.Room, base64DecodedLogoData)
	if err != nil {
		return fmt.Errorf(" %w", err)
	}
	return nil
}

func DeleteLogoUpload(client *Client, event *Event) error {
	s := store
	err := s.deleteLogo(event.Room)
	if err != nil {
		return fmt.Errorf(" %w", err)
	}
	return nil
}

func FetchLogo(w http.ResponseWriter, roomCode string) error {
	s := store
	logoData, err := s.loadLogo(roomCode)
	if err != nil {
		w.WriteHeader(404)
		return err
	}
	w.WriteHeader(200)
	w.Write(logoData)
	return nil
}
