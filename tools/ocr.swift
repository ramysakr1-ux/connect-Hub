import Foundation
import Vision
import AppKit

// Emits one TSV line per recognised line: x<TAB>y<TAB>text, in normalised
// coordinates with y measured from the TOP, so a two-column page can be put
// back into reading order by the caller.
for path in CommandLine.arguments.dropFirst() {
    guard let img = NSImage(contentsOfFile: path),
          let cg = img.cgImage(forProposedRect: nil, context: nil, hints: nil) else {
        FileHandle.standardError.write("cannot read \(path)\n".data(using: .utf8)!); continue
    }
    let req = VNRecognizeTextRequest()
    req.recognitionLevel = .accurate
    req.recognitionLanguages = ["en-GB", "en-US"]
    req.usesLanguageCorrection = true
    let handler = VNImageRequestHandler(cgImage: cg, options: [:])
    do { try handler.perform([req]) } catch { continue }
    print("###PAGE\t\(path)")
    for obs in (req.results ?? []) {
        guard let c = obs.topCandidates(1).first else { continue }
        let b = obs.boundingBox          // origin bottom-left, normalised
        let x = b.origin.x
        let y = 1.0 - (b.origin.y + b.height)
        let text = c.string.replacingOccurrences(of: "\t", with: " ")
        print(String(format: "%.4f\t%.4f\t", x, y) + text)
    }
}
